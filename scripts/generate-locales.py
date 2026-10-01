#!/usr/bin/env python3
"""Generate draft Indian-language Selvi copy from curated Tamil source data."""
import concurrent.futures
import json
import os
import subprocess
from pathlib import Path
from openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
BASE = json.loads((ROOT / "client/src/data/localeSource.ta.json").read_text(encoding="utf-8"))
service_js = "import { SERVICE_CATALOG } from './client/src/data/serviceCatalog.ts'; console.log(JSON.stringify(SERVICE_CATALOG));"
services = json.loads(subprocess.check_output(["pnpm", "exec", "tsx", "-e", service_js], cwd=ROOT, text=True))
TARGETS = {
    "hi": ("Hindi", "Hindi as used in India (hi-IN)"),
    "bn": ("Bengali", "Indian Bangla (bn-IN)"),
    "mr": ("Marathi", "Marathi as used in India (mr-IN)"),
    "te": ("Telugu", "Telugu as used in India (te-IN)"),
}

client = OpenAI()


def schema_for(locale: str):
    service_schema = {}
    for service in services:
        service_schema[service["id"]] = {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "name": {"type": "string"},
                "category": {"type": "string"},
                "goal": {"type": "string"},
                "steps": {"type": "array", "minItems": len(service["stepsTamil"]), "maxItems": len(service["stepsTamil"]), "items": {"type": "string"}},
                "prepare": {"type": "array", "minItems": len(service["prepareTamil"]), "maxItems": len(service["prepareTamil"]), "items": {"type": "string"}},
                "safety": {"type": "array", "minItems": len(service["safetyTamil"]), "maxItems": len(service["safetyTamil"]), "items": {"type": "string"}},
                "scope": {"type": "string"},
            },
            "required": ["name", "category", "goal", "steps", "prepare", "safety", "scope"],
        }
    ui_schema = {key: {"type": "string"} for key in BASE["ui"]}
    state_schema = {
        state["english"]: {"type": "string"}
        for state in BASE["states"]
    }
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "locale": {"type": "string", "enum": [locale]},
            "ui": {"type": "object", "additionalProperties": False, "properties": ui_schema, "required": list(ui_schema)},
            "states": {"type": "object", "additionalProperties": False, "properties": state_schema, "required": list(state_schema)},
            "services": {"type": "object", "additionalProperties": False, "properties": service_schema, "required": list(service_schema)},
        },
        "required": ["locale", "ui", "states", "services"],
    }


def translate(locale: str):
    language, locale_note = TARGETS[locale]
    payload = {
        "ui": BASE["ui"],
        "states": [{"english": state["english"], "tamil": state["tamil"]} for state in BASE["states"]],
        "services": [
            {
                "id": service["id"],
                "nameTamil": service["nameTamil"],
                "categoryTamil": service["categoryTamil"],
                "goalTamil": service["goalTamil"],
                "stepsTamil": service["stepsTamil"],
                "prepareTamil": service["prepareTamil"],
                "safetyTamil": service["safetyTamil"],
                "scopeTamil": service["scopeTamil"],
            }
            for service in services
        ],
    }
    messages = [
        {
            "role": "system",
            "content": (
                f"You are a careful public-service plain-language translator. Translate the Tamil source copy into {locale_note}. "
                "Use short, familiar, respectful wording for adults with little digital experience. Preserve every factual qualifier, warning, limitation, eligibility condition, number, named form, portal button label, and distinction exactly. "
                "Do not add, remove, infer, or simplify away a condition. Preserve Latin-letter portal labels, form numbers, URLs, acronyms (OTP, PAN, Aadhaar, ECI, CAN, REV-101, REV-103, ARN, PSK, POPSK, e-EPIC, DigiLocker), and official organization names. "
                "For state names, return a recognizable standard name in the target language's script. This is a reader-friendly Selvi explanation, not an official translation. Output exactly the requested JSON structure."
            ),
        },
        {"role": "user", "content": json.dumps(payload, ensure_ascii=False)},
    ]
    for attempt in range(3):
        response = client.chat.completions.create(
            model="gpt-5-mini",
            messages=messages,
            max_completion_tokens=12000,
            extra_body={"reasoning": {"effort": "minimal"}},
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": f"nila_locale_{locale}",
                    "strict": True,
                    "schema": schema_for(locale),
                },
            },
        )
        content = response.choices[0].message.content
        if content:
            result = json.loads(content)
            if set(result["services"]) == {service["id"] for service in services}:
                for service in services:
                    for source_key, target_key in (("stepsTamil", "steps"), ("prepareTamil", "prepare"), ("safetyTamil", "safety")):
                        if len(result["services"][service["id"]][target_key]) != len(service[source_key]):
                            raise ValueError(f"{locale}/{service['id']}/{target_key} item count changed")
                print(f"translated={locale} input_tokens={response.usage.prompt_tokens} output_tokens={response.usage.completion_tokens}", flush=True)
                return locale, result
        if attempt == 2:
            raise RuntimeError(f"No valid translation returned for {locale}")
    raise RuntimeError(locale)


if not os.environ.get("OPENAI_API_KEY") or not os.environ.get("OPENAI_API_BASE"):
    raise SystemExit("The configured translation proxy is unavailable.")

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    results = dict(executor.map(translate, TARGETS))

output = ROOT / "client/src/data/localeCopy.generated.json"
output.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"wrote={output} locales={','.join(results)} services={len(services)}")
