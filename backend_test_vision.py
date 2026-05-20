"""
Backend test for POST /api/chat with vision (image_base64) support.
Tests the task "API Chat - Photo Vision Diagnosis".
"""
import os
import io
import base64
import sys
import requests
from PIL import Image, ImageDraw
from pymongo import MongoClient
from dotenv import load_dotenv

# Load backend env to access Mongo
load_dotenv('/app/backend/.env')
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']

# Frontend env -> external backend URL
with open('/app/frontend/.env') as f:
    for line in f:
        if line.startswith('EXPO_PUBLIC_BACKEND_URL='):
            BASE = line.split('=', 1)[1].strip().strip('"') + '/api'
            break

print(f"Backend base URL: {BASE}")
print(f"Mongo DB: {DB_NAME}")

EMAIL = "test_agriscan@example.com"
PASSWORD = "testpassword123"

results = []

def record(name, ok, detail=""):
    results.append((name, ok, detail))
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name}: {detail[:300]}")


def make_test_image_base64():
    """Generate a small synthetic 'plant leaf' JPEG and return base64 string."""
    img = Image.new('RGB', (200, 200), color=(34, 139, 34))  # green
    d = ImageDraw.Draw(img)
    # Draw some 'dark spots' to look like a diseased leaf
    for cx, cy in [(50, 50), (120, 80), (80, 140), (160, 160), (40, 170)]:
        d.ellipse([cx-15, cy-15, cx+15, cy+15], fill=(40, 25, 10))
    # add lighter veins
    d.line([(100, 0), (100, 200)], fill=(20, 80, 20), width=3)
    d.line([(0, 100), (200, 100)], fill=(20, 80, 20), width=2)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=85)
    return base64.b64encode(buf.getvalue()).decode('ascii')


def login_or_signup():
    r = requests.post(f"{BASE}/auth/login", json={"email": EMAIL, "password": PASSWORD}, timeout=30)
    if r.status_code == 200:
        return r.json()
    # signup
    print("Login failed, attempting signup...")
    r = requests.post(f"{BASE}/auth/signup", json={
        "email": EMAIL,
        "password": PASSWORD,
        "display_name": "Agriculteur Test",
        "farm_name": "Ferme Test",
        "location": "Île-de-France",
        "phone_number": "0612345678",
    }, timeout=30)
    r.raise_for_status()
    return r.json()


def create_diagnostic(uid):
    r = requests.post(
        f"{BASE}/diagnostics",
        params={"user_id": uid},
        json={"culture": "Tomates", "symptoms": "Feuilles avec taches noires"},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


def main():
    # --- Step 1: auth + diagnostic ---
    user = login_or_signup()
    uid = user['uid']
    print(f"Using UID: {uid}")

    diag = create_diagnostic(uid)
    diag_id = diag['id']
    print(f"Diagnostic created: {diag_id}")

    img_b64 = make_test_image_base64()
    print(f"Generated test image base64 (len={len(img_b64)})")

    # =====================================================================
    # SCENARIO 1: Chat with image (vision diagnosis) - raw base64, no prefix
    # =====================================================================
    try:
        r = requests.post(
            f"{BASE}/chat",
            params={"user_id": uid},
            json={
                "diagnostic_id": diag_id,
                "message": "Analyse cette photo de feuille de tomate s'il te plaît",
                "image_base64": img_b64,
            },
            timeout=120,
        )
        if r.status_code != 200:
            record("S1 chat with image (raw b64)", False, f"HTTP {r.status_code}: {r.text[:300]}")
        else:
            data = r.json()
            content = data.get('content', '')
            if not content or len(content) < 30:
                record("S1 chat with image (raw b64)", False, f"Empty/short AI content: {content!r}")
            else:
                # Look for any visual-analysis cue (loose check)
                low = content.lower()
                visual_cues = ['photo', 'image', 'visuel', 'tache', 'observ', 'vois', 'feuille', 'couleur']
                hits = [c for c in visual_cues if c in low]
                record(
                    "S1 chat with image (raw b64)",
                    True,
                    f"AI returned {len(content)} chars; visual cues found: {hits}",
                )
                print(f"  AI excerpt: {content[:250]!r}")
    except Exception as e:
        record("S1 chat with image (raw b64)", False, f"Exception: {e}")

    # =====================================================================
    # Verify image was persisted in messages_{diag_id}
    # =====================================================================
    try:
        mc = MongoClient(MONGO_URL)
        coll = mc[DB_NAME][f"messages_{diag_id}"]
        user_msgs = list(coll.find({"role": "user"}))
        if not user_msgs:
            record("S1 DB: user message persisted", False, "No user messages in collection")
        else:
            last = user_msgs[-1]
            if last.get("image_base64"):
                # Confirm payload matches what we sent (after strip)
                ok_match = last["image_base64"] == img_b64
                record(
                    "S1 DB: image_base64 stored on user msg",
                    True,
                    f"image_base64 present (len={len(last['image_base64'])}, exact match={ok_match})",
                )
            else:
                record("S1 DB: image_base64 stored on user msg", False, f"image_base64 missing on user msg keys={list(last.keys())}")
        mc.close()
    except Exception as e:
        record("S1 DB persistence check", False, f"Exception: {e}")

    # =====================================================================
    # SCENARIO 2: Chat with data:image/...;base64,... prefix
    # =====================================================================
    try:
        prefixed = "data:image/jpeg;base64," + img_b64
        r = requests.post(
            f"{BASE}/chat",
            params={"user_id": uid},
            json={
                "diagnostic_id": diag_id,
                "message": "Voici une autre photo avec un préfixe data-URI",
                "image_base64": prefixed,
            },
            timeout=120,
        )
        if r.status_code != 200:
            record("S2 chat with data-URI prefix", False, f"HTTP {r.status_code}: {r.text[:400]}")
        else:
            data = r.json()
            content = data.get('content', '')
            if not content:
                record("S2 chat with data-URI prefix", False, "Empty AI content")
            else:
                record("S2 chat with data-URI prefix", True, f"AI ok (len={len(content)})")

        # DB check that stored image_base64 has prefix stripped
        mc = MongoClient(MONGO_URL)
        coll = mc[DB_NAME][f"messages_{diag_id}"]
        user_msgs = list(coll.find({"role": "user"}).sort("created_at", 1))
        last_user = user_msgs[-1] if user_msgs else None
        if last_user and last_user.get("image_base64"):
            stored = last_user["image_base64"]
            if stored.startswith("data:"):
                record("S2 DB: data-URI prefix was NOT stripped", False, f"stored still has prefix: {stored[:40]}")
            else:
                exact = stored == img_b64
                record("S2 DB: data-URI prefix correctly stripped", True, f"stripped ok (exact match raw={exact})")
        else:
            record("S2 DB: data-URI prefix check", False, "Could not locate last user message with image")
        mc.close()
    except Exception as e:
        record("S2 chat with data-URI prefix", False, f"Exception: {e}")

    # =====================================================================
    # SCENARIO 3: Chat WITHOUT image - backwards compatibility
    # =====================================================================
    try:
        r = requests.post(
            f"{BASE}/chat",
            params={"user_id": uid},
            json={
                "diagnostic_id": diag_id,
                "message": "Quelles sont les causes probables des taches noires sur les feuilles de tomate ?",
            },
            timeout=120,
        )
        if r.status_code != 200:
            record("S3 chat without image (back-compat)", False, f"HTTP {r.status_code}: {r.text[:400]}")
        else:
            data = r.json()
            content = data.get('content', '')
            low = content.lower()
            ok = bool(content) and any(k in low for k in ['tomate', 'tache', 'maladie', 'feuille', 'mildiou', 'alternar', 'septor'])
            record("S3 chat without image (back-compat)", ok, f"AI response len={len(content)}; topical={ok}")
    except Exception as e:
        record("S3 chat without image (back-compat)", False, f"Exception: {e}")

    # =====================================================================
    # SCENARIO 4: GET /api/messages/{diagnostic_id} - image returned
    # =====================================================================
    try:
        r = requests.get(
            f"{BASE}/messages/{diag_id}",
            params={"user_id": uid},
            timeout=30,
        )
        if r.status_code != 200:
            record("S4 GET messages", False, f"HTTP {r.status_code}: {r.text[:300]}")
        else:
            msgs = r.json()
            user_with_img = [m for m in msgs if m.get('role') == 'user' and m.get('image_base64')]
            if not user_with_img:
                record("S4 messages contain image_base64", False, f"No user messages contain image_base64. Total messages: {len(msgs)}")
            else:
                first = user_with_img[0]
                ok_len = len(first['image_base64']) > 100
                record(
                    "S4 messages contain image_base64",
                    ok_len,
                    f"{len(user_with_img)} user msg(s) with image_base64; first len={len(first['image_base64'])}",
                )
    except Exception as e:
        record("S4 GET messages", False, f"Exception: {e}")

    # ----------------- summary -----------------
    print("\n=========== TEST SUMMARY ===========")
    passed = sum(1 for _, ok, _ in results if ok)
    total = len(results)
    for n, ok, d in results:
        print(f"  [{'PASS' if ok else 'FAIL'}] {n}")
    print(f"Total: {passed}/{total} passed")
    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
