# MotoHub

MotoHub iskolai vizsgaremek: motorkerékpár-szerviz adminisztrációs alkalmazás. Az adminisztrátor ügyfeleket, motorokat és munkalapokat kezelhet, munkadíjakat és alkatrészeket vehet fel, követheti a státuszokat, és megtekintheti a munkalapok összesített díját.

## Technológiák

- **Frontend:** Angular, TypeScript, RxJS
- **Backend:** Node.js, Express
- **Adatbázis:** SQLite, `better-sqlite3`
- **Belépés:** JWT és bcrypt jelszóhash

Az adatmodell ábráját a [docs/adatbazis-es-er-diagram.md](docs/adatbazis-es-er-diagram.md), az üres adatbázisséma exportját a [docs/motohub-schema.sql](docs/motohub-schema.sql), a kézi ellenőrzési eseteket pedig a [docs/tesztelesi-utmutato.md](docs/tesztelesi-utmutato.md) tartalmazza.

A vizsgaremek részletes fejlesztési dokumentuma a [docs/MotoHub-vizsgadokumentum.docx](docs/MotoHub-vizsgadokumentum.docx), a bemutató diasora az [output/MotoHub-bemutato.pptx](output/MotoHub-bemutato.pptx) fájl.

Az alkalmazás nem használ Dockert vagy Spring Bootot.

## Követelmények

- Node.js és npm
- Windows, macOS vagy Linux

## Első indítás

### 1. Backend telepítése és beállítása

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Nyisd meg a `backend/.env` fájlt. A `JWT_SECRET` értékének legalább 32 bájtos, véletlenszerű titoknak kell lennie. Például a backend könyvtárban futtasd ezt, majd másold a kiírt értéket a `JWT_SECRET=` sorba:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Állítsd be az admin felhasználónevet és egy legalább 12 karakteres jelszót az `ADMIN_USERNAME` és `ADMIN_PASSWORD` sorban. Ezután hozd létre az adatbázist és az adminfiókot:

```powershell
npm run db:init
npm run seed:admin
```

Indítsd el a backendet egy terminálban:

```powershell
npm start
```

Az API címe: `http://localhost:3000/api`.

### 2. Frontend indítása

Másik terminálban, a projekt gyökeréből:

```powershell
cd frontend
npm install
npm start
```

Nyisd meg a `http://localhost:4200` címet, majd válaszd az admin bejelentkezést. Az adminadatokat a backend beállításakor megadott értékekkel használd.

## Funkciók

- Ügyfelek létrehozása, listázása, módosítása és törlése
- Motorkerékpárok kezelése és ügyfélhez rendelése
- Munkalapok kezelése, keresése és státusz szerinti szűrése
- Munkalap-státuszok: nyitott, folyamatban, alkatrészre vár, átadásra kész, befejezve
- Munkadíj- és alkatrésztételek kezelése, részösszegek és végösszeg
- Dashboard ügyfél-, motor- és munkalapszámokkal, valamint státuszösszesítéssel
- JWT-vel védett adminisztráció és jelszómódosítás a Beállítások oldalon

## Adatmodell

```text
customers 1 ── * motorcycles 1 ── * work_orders
                                      ├── * labor_items
                                      └── * part_items

admins (bejelentkezési fiókok)
```

A munkadíjtétel összege `hours × hourly_rate`, az alkatrésztételé `quantity × unit_price`. A munkalap végösszege a két tételcsoport összegének összege. Az adatbázisfájl a `backend/database/motohub.db` helyen jön létre; a Git nem követi az adatbázis- és `.env` fájlokat.

## Adatbázis-parancsok

- `npm run db:init` – létrehozza a szükséges táblákat; a meglévő adatokat nem törli.
- `npm run seed:admin` – csak akkor hoz létre adminfiókot, ha még nincs ilyen; a meglévő adminfiókot nem módosítja.
- `npm run seed` – **törli az ügyfeleket, motorokat, munkalapokat és azok tételeit**, majd mintaadatokat tölt be. Csak üres vagy kifejezetten újraindítandó tesztadatbázison használd.

## Fejlesztői ellenőrzés

Frontend build:

```powershell
cd frontend
npm run build
```

Angular tesztek:

```powershell
npm test
```

A backend API-végpontjai a `backend/api-test.http` fájlban vannak dokumentálva. A bejelentkezési példák használatához állítsd be a REST Client környezetében az `adminUsername`, `adminPassword` és `authToken` értékeket.

## API-áttekintés

| Végpont | Műveletek |
| --- | --- |
| `/api/auth` | `POST /login`, védett `POST /change-password` |
| `/api/customers` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| `/api/motorcycles` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| `/api/work-orders` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| `/api/labor-items` | CRUD műveletek és `GET /work-order/:workOrderId` |
| `/api/part-items` | CRUD műveletek és `GET /work-order/:workOrderId` |

A felsorolt bejelentkezési végponton kívül minden API-művelet JWT tokent vár az `Authorization: Bearer <token>` fejlécben. A hibaválaszok JSON formátumúak; az érvénytelen adatok `400`, a hiányzó vagy hibás hitelesítés `401`, a nem található rekord vagy útvonal `404` választ ad.

## Biztonsági megjegyzések

- A `backend/.env` fájl helyi beállításokra való, és nem kerül Gitbe.
- Ne ossz meg JWT-titkot, adminjelszót vagy adatbázisfájlt.
- A jelszavakat a backend bcrypt hashként tárolja; a jelszócsere új jelszó beállításakor legalább 12 karaktert kér.
