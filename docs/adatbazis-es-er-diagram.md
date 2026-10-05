# Adatbázis és ER-diagram

Az alkalmazás SQLite-adatbázisa a `backend/database/motohub.db` fájl. Az adatbázis sémáját a `backend/database/init.js` hozza létre.

## ER-diagram

```mermaid
erDiagram
    ADMINS {
        INTEGER id PK
        TEXT username UK
        TEXT password_hash
        DATETIME created_at
    }

    CUSTOMERS {
        INTEGER id PK
        TEXT name
        TEXT phone
        TEXT email
        DATETIME created_at
        DATETIME updated_at
    }

    MOTORCYCLES {
        INTEGER id PK
        INTEGER customer_id FK
        TEXT brand
        TEXT model
        INTEGER model_year
        TEXT license_plate
        TEXT vin
        DATETIME created_at
        DATETIME updated_at
    }

    WORK_ORDERS {
        INTEGER id PK
        INTEGER motorcycle_id FK
        TEXT status
        TEXT description
        DATETIME created_at
        DATETIME updated_at
    }

    LABOR_ITEMS {
        INTEGER id PK
        INTEGER work_order_id FK
        TEXT description
        REAL hours
        REAL hourly_rate
        DATETIME created_at
    }

    PART_ITEMS {
        INTEGER id PK
        INTEGER work_order_id FK
        TEXT name
        REAL quantity
        REAL unit_price
        DATETIME created_at
    }

    CUSTOMERS ||--o{ MOTORCYCLES : owns
    MOTORCYCLES ||--o{ WORK_ORDERS : receives
    WORK_ORDERS ||--o{ LABOR_ITEMS : includes
    WORK_ORDERS ||--o{ PART_ITEMS : includes
```

Az `admins` tábla önálló bejelentkezési fiókokat tárol. A `password_hash` bcrypt hash; nyers jelszó nem kerül az adatbázisba.

## Kapcsolatok és üzleti szabályok

- Egy ügyfélhez több motorkerékpár tartozhat; egy motorkerékpár egy ügyfélhez tartozik.
- Egy motorkerékpárhoz több munkalap készülhet; egy munkalap egy motorkerékpárhoz tartozik.
- Egy munkalaphoz több munkadíj- és alkatrésztétel rögzíthető.
- A munkadíjtételek és alkatrésztételek törlődnek, ha a hozzájuk tartozó munkalap törlődik (`ON DELETE CASCADE`).
- A munkalap státuszának megengedett értékei: `OPEN`, `IN_PROGRESS`, `WAITING_PARTS`, `READY_FOR_PICKUP`, `COMPLETED`.
- A munkalap végösszege számított érték: a `hours × hourly_rate` munkadíjak és a `quantity × unit_price` alkatrészek összege. A végösszeg nincs külön eltárolva.

## Séma létrehozása és adatbázisfájl

Backend könyvtárból futtasd:

```powershell
npm run db:init
```

Ez a séma nélküli adatbázist előkészíti, de meglévő adatokat nem töröl. A tesztadatokat betöltő `npm run seed` parancs törli a munkalaphoz kapcsolódó ügyfél-, motor- és tételadatokat is, ezért csak eldobható tesztadatbázison futtasd.

Az ER-diagram sémaforrása a `backend/database/init.js`; a diagram leírása Mermaid formátumú, ezért Mermaid-kompatibilis Markdown-megjelenítőben vizuálisan is kirajzolható.
