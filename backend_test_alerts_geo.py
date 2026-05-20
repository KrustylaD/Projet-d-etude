"""Re-test POST /api/alerts with geolocation fields."""
import sys
import requests
from pathlib import Path

env_path = Path("/app/frontend/.env")
backend_url = None
for line in env_path.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        backend_url = line.split("=", 1)[1].strip().strip('"').strip("'")
        break
if not backend_url:
    print("ERROR: EXPO_PUBLIC_BACKEND_URL not found")
    sys.exit(1)

API = f"{backend_url}/api"
print(f"Testing against: {API}")

EMAIL = "test_agriscan@example.com"
PASSWORD = "testpassword123"

results = []
def check(name, cond, detail=""):
    status = "PASS" if cond else "FAIL"
    results.append((name, cond, detail))
    print(f"  [{status}] {name} {detail if not cond else ''}")

# 1. Login
print("\n1) Login")
r = requests.post(f"{API}/auth/login", json={"email": EMAIL, "password": PASSWORD}, timeout=30)
check("Login 200", r.status_code == 200, f"got {r.status_code}: {r.text[:200]}")
if r.status_code != 200:
    sys.exit(1)
uid = r.json()["uid"]
print(f"  UID: {uid}")

# 2. POST alert WITH location
print("\n2) POST /api/alerts WITH location")
body_with = {
    "type": "maladie",
    "message": "Mildiou",
    "severity": "critical",
    "latitude": 43.6047,
    "longitude": 1.4442,
    "location_name": "Toulouse"
}
r = requests.post(f"{API}/alerts?user_id={uid}", json=body_with, timeout=30)
check("POST with location 200", r.status_code == 200, f"got {r.status_code}: {r.text[:300]}")
alert_with_id = None
if r.status_code == 200:
    j = r.json()
    alert_with_id = j.get("id")
    check("latitude=43.6047", j.get("latitude") == 43.6047, f"got {j.get('latitude')}")
    check("longitude=1.4442", j.get("longitude") == 1.4442, f"got {j.get('longitude')}")
    check("location_name='Toulouse'", j.get("location_name") == "Toulouse", f"got {j.get('location_name')}")

# 3. POST alert WITHOUT location (backwards compat)
print("\n3) POST /api/alerts WITHOUT location")
body_without = {
    "type": "système",
    "message": "Test sans localisation",
    "severity": "info"
}
r = requests.post(f"{API}/alerts?user_id={uid}", json=body_without, timeout=30)
check("POST without location 200", r.status_code == 200, f"got {r.status_code}: {r.text[:300]}")
alert_without_id = None
if r.status_code == 200:
    j = r.json()
    alert_without_id = j.get("id")
    check("latitude is None", j.get("latitude") is None, f"got {j.get('latitude')}")
    check("longitude is None", j.get("longitude") is None, f"got {j.get('longitude')}")
    check("location_name is None", j.get("location_name") is None, f"got {j.get('location_name')}")

# 4. GET alerts
print("\n4) GET /api/alerts/{uid}")
r = requests.get(f"{API}/alerts/{uid}", timeout=30)
check("GET alerts 200", r.status_code == 200, f"got {r.status_code}")
if r.status_code == 200:
    alerts = r.json()
    print(f"  Retrieved {len(alerts)} alerts")
    by_id = {a["id"]: a for a in alerts}
    if alert_with_id and alert_with_id in by_id:
        a = by_id[alert_with_id]
        check("GET: with-loc has lat 43.6047", a.get("latitude") == 43.6047, f"got {a.get('latitude')}")
        check("GET: with-loc has lng 1.4442", a.get("longitude") == 1.4442, f"got {a.get('longitude')}")
        check("GET: with-loc has location_name Toulouse", a.get("location_name") == "Toulouse", f"got {a.get('location_name')}")
    else:
        check("GET: with-loc alert present", False, "not found in list")
    if alert_without_id and alert_without_id in by_id:
        a = by_id[alert_without_id]
        check("GET: without-loc has lat=None", a.get("latitude") is None, f"got {a.get('latitude')}")
        check("GET: without-loc has lng=None", a.get("longitude") is None, f"got {a.get('longitude')}")
        check("GET: without-loc has location_name=None", a.get("location_name") is None, f"got {a.get('location_name')}")
    else:
        check("GET: without-loc alert present", False, "not found in list")

print("\n" + "=" * 60)
passed = sum(1 for _, ok, _ in results if ok)
total = len(results)
print(f"RESULT: {passed}/{total} assertions passed")
if passed != total:
    print("\nFAILURES:")
    for name, ok, det in results:
        if not ok:
            print(f"  - {name}: {det}")
    sys.exit(1)
print("ALL ASSERTIONS PASSED")
