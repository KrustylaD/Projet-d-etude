# Comptes de test — AgriScan AI

## Utilisateur normal (farmer)

| Champ | Valeur |
|-------|--------|
| Email | `farmer@test.com` |
| Mot de passe | `password123` |
| Nom | Jean Agriculteur |
| Ferme | Ferme du Vallon |
| Téléphone | 0612345678 |
| Localisation | Lyon |
| Rôle | `farmer` |

## Administrateur

| Champ | Valeur |
|-------|--------|
| Email | `admin@test.com` |
| Mot de passe | `password123` |
| Nom | Marie Administratrice |
| Ferme | Admin SARL |
| Téléphone | 0698765432 |
| Localisation | Paris |
| Rôle | `admin` |

---

Les deux utilisateurs ont été créés dans MongoDB (collection `users`).  
L'onglet "Admin" dans l'app apparaît uniquement pour le compte `admin@test.com` (rôle `admin`).
