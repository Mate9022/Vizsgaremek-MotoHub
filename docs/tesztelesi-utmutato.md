# MotoHub tesztelési útmutató

Ez a dokumentum a fejlesztői build és a vizsgabemutató előtti kézi ellenőrzést írja le. A normál használatú SQLite-adatbázis helyett teszteléshez külön adatbázist vagy biztonsági másolatot használj.

## Előkészítés

1. Ellenőrizd, hogy a backend `.env` beállítása megvan, és az API elindul a `http://localhost:3000` címen.
2. Indítsd el az Angular felületet a `http://localhost:4200` címen.
3. Lépj be a beállított adminfiókkal. Ne használj README-ben vagy tesztdokumentumban megosztott jelszót.
4. Ellenőrizd a bejelentkezést és a JWT-védelmet: kijelentkezett állapotban az adminoldalra irányítás a bejelentkezési oldalra vigyen.

## Kézi funkcionális ellenőrzés

| Terület | Művelet | Elvárt eredmény |
| --- | --- | --- |
| Ügyfelek | Hozz létre, nyiss meg, módosíts, majd törölj egy tesztügyfelet. | A lista minden művelet után a mentett adatot mutatja; üres név vagy hibás e-mail nem menthető. |
| Motorkerékpárok | Rögzíts motort létező ügyfélhez, módosítsd, majd töröld. | A gyártási év megmarad; hiányzó ügyfél, márka vagy modell nem menthető. |
| Munkalap | Hozz létre munkalapot egy motorhoz, módosítsd leírását és státuszát, majd ellenőrizd a listában. | A kiválasztott motor tulajdonosa látszik, az állapot szűrhető; érvénytelen státusz nem fogadható el. |
| Munkadíj | Adj hozzá például 1,5 órát 12 000 Ft óradíjjal. | A tétel összege 18 000 Ft; nulla vagy negatív érték nem menthető. |
| Alkatrész | Adj hozzá 2 darabot 5 000 Ft egységáron. | A tétel összege 10 000 Ft; nulla vagy negatív érték nem menthető. |
| Végösszeg | Nézd meg a két fenti tételt tartalmazó munkalapot. | A munkadíj összesen 18 000 Ft, az alkatrész összesen 10 000 Ft, a végösszeg 28 000 Ft. |
| Dashboard | Frissítsd a dashboardot új vagy módosított munkalapok után. | Összesítések és státuszdarabszámok az adatbázis valós adatait tükrözik. |
| Beállítások | Adj meg helyes jelenlegi jelszót és egyező, legalább 12 karakteres új jelszót tesztfiókon. | A jelszó sikeresen módosul; hibás jelenlegi jelszó és nem egyező új jelszavak esetén hibaüzenet jelenik meg. |

## API- és hibaválasz-ellenőrzés

Az API-próbákhoz használható a `backend/api-test.http`. A REST Client környezetben add meg az `adminUsername`, `adminPassword` és `authToken` változókat; JWT-t ne ments a verziókezelt fájlba.

Ellenőrizendő válaszok:

- bejelentkezés nélkül védett végpont: `401` JSON-válasz;
- hiányzó kötelező mező, hibás típus, érvénytelen szám vagy státusz: `400` JSON-válasz;
- nem létező rekord: `404` JSON-válasz;
- nem létező API-útvonal: `404` JSON-válasz;
- hibás JSON-kérés: `400` JSON-válasz;
- váratlan backendhiba: `500` JSON-válasz, belső stack trace nélkül a kliens felé.

## Fejlesztői build

```powershell
cd frontend
npm run build
```

A build során előforduló komponens-CSS méretfigyelmeztetés nem feltétlenül buildhiba; a parancs kilépési kódját és az „Application bundle generation complete” eredményt is ellenőrizd.

## Rögzített fejlesztői ellenőrzés

2026. október 5-én az Angular production build sikeresen lefutott. Az Angular tesztfuttató 10 tesztet futtatott le 10 tesztfájlban, mindegyik sikeres lett. A build három komponens-CSS méretfigyelmeztetést adott, de hibával nem állt le.

Elkülönített, ideiglenes SQLite-adatbázison végig lett próbálva a bejelentkezés, a JWT-védelem, valamint az ügyfelek, motorkerékpárok, munkalapok, munkadíjak és alkatrészek teljes CRUD-folyamata. A munkadíj- és alkatrésztételek munkalap szerinti listázása, a munkalap státuszának módosítása, a gyártási év megőrzése és a törölt munkalap lekérése is ellenőrizve lett. A teszt során minden rekord törlése sikeres volt. A valódi helyi adatbázis nem változott.

A korábbi elkülönített API-próbák a hibás bemenetek `400`, a védelem nélküli kérés `401`, a hibás JSON `400` és az ismeretlen útvonal `404` JSON-válaszát is ellenőrizték.
