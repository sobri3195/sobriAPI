# SobriAPI Docs

Quickstart:

```ts
import { SobriClient } from "@sobriapi/sdk";

const sobri = new SobriClient({ apiKey: process.env.SOBRI_KEY });
const weather = await sobri.weather.now({ lat: -6.2, lon: 106.8 });
```
