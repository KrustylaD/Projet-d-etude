#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
IP=$(ip route get 1 2>/dev/null | head -1 | awk '{print $7}')
PORT=8000

if [ -z "$IP" ]; then
  echo "❌ Impossible de détecter l'IP locale."
  exit 1
fi

echo "🌐 IP détectée : $IP"

echo "🔧 Mise à jour de frontend/.env..."
if grep -q "^EXPO_PUBLIC_BACKEND_URL=" "$ROOT_DIR/frontend/.env"; then
  sed -i "s|^EXPO_PUBLIC_BACKEND_URL=.*|EXPO_PUBLIC_BACKEND_URL=http://$IP:$PORT|" "$ROOT_DIR/frontend/.env"
else
  echo "EXPO_PUBLIC_BACKEND_URL=http://$IP:$PORT" >> "$ROOT_DIR/frontend/.env"
fi

echo "🚀 Démarrage du backend (port $PORT)..."
cd "$ROOT_DIR/backend"
./venv/bin/uvicorn server:app --reload --host 0.0.0.0 --port $PORT &
BACKEND_PID=$!

echo "📱 Démarrage du frontend..."
cd "$ROOT_DIR/frontend"
EXPO_PORT=8082
while lsof -i ":$EXPO_PORT" &>/dev/null 2>&1; do
  EXPO_PORT=$((EXPO_PORT + 1))
done
npx expo start --port $EXPO_PORT &
FRONTEND_PID=$!

echo "📱 Lancement de la surveillance USB..."

wait_for_device_and_scrcpy() {
  if ! command -v adb &>/dev/null; then
    echo "⚠️  adb non trouvé, ignore scrcpy"
    return
  fi
  if ! command -v scrcpy &>/dev/null; then
    echo "⚠️  scrcpy non trouvé, ignore"
    return
  fi
  echo "📱 Surveillance USB active — branche ton téléphone pour lancer scrcpy"
  while true; do
    if adb get-state 2>/dev/null | grep -q "device"; then
      echo "📱 Téléphone détecté, lancement de scrcpy..."
      scrcpy 2>/dev/null || true
      echo "📱 scrcpy arrêté, attente de reconnexion..."
    fi
    sleep 2
  done
}

wait_for_device_and_scrcpy &
SCRCPY_PID=$!

echo ""
echo "✅ Backend PID  : $BACKEND_PID"
echo "✅ Frontend PID : $FRONTEND_PID"
echo "✅ Scrcpy PID   : $SCRCPY_PID"
echo ""
echo "📌 Backend accessible sur : http://$IP:$PORT"
echo "📌 Scanne le QR code Expo avec ton téléphone"
echo ""
echo "Appuie sur Ctrl+C pour tout arrêter."

trap "kill $BACKEND_PID $FRONTEND_PID $SCRCPY_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
