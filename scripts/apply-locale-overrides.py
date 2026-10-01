#!/usr/bin/env python3
"""Apply reviewed locale corrections after automatic draft translation."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
output = ROOT / "client/src/data/localeCopy.generated.json"
overrides_path = ROOT / "scripts/locale-overrides.json"
data = json.loads(output.read_text(encoding="utf-8"))
overrides = json.loads(overrides_path.read_text(encoding="utf-8"))

for locale, patch in overrides.items():
    if locale not in data:
        raise ValueError(f"Locale override does not exist in generated data: {locale}")
    for key, value in patch.get("ui", {}).items():
        if key not in data[locale]["ui"]:
            raise ValueError(f"Unknown UI key: {locale}.ui.{key}")
        data[locale]["ui"][key] = value
    for service_id, service_patch in patch.get("services", {}).items():
        if service_id not in data[locale]["services"]:
            raise ValueError(f"Unknown service: {locale}.services.{service_id}")
        for key, value in service_patch.items():
            previous = data[locale]["services"][service_id].get(key)
            if isinstance(previous, list) and len(previous) != len(value):
                raise ValueError(f"Correction changed array length: {locale}/{service_id}/{key}")
            if previous is None:
                raise ValueError(f"Unknown service field: {locale}/{service_id}/{key}")
            data[locale]["services"][service_id][key] = value

output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"applied reviewed overrides for {len(overrides)} locales to {output}")
