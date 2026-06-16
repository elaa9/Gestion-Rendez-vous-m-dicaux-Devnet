from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix="/api/external", tags=["API Externe"])

COUNTRY_NAMES = {
    "DZ": "Algérie", "MA": "Maroc", "FR": "France", "TN": "Tunisie",
    "EG": "Égypte", "US": "États-Unis", "GB": "Royaume-Uni", "DE": "Allemagne",
    "IT": "Italie", "ES": "Espagne", "CA": "Canada", "BE": "Belgique",
    "CH": "Suisse", "NL": "Pays-Bas", "SE": "Suède", "NO": "Norvège",
    "PT": "Portugal", "TR": "Turquie", "LB": "Liban", "SY": "Syrie",
    "SA": "Arabie Saoudite", "AE": "Émirats Arabes Unis", "QA": "Qatar",
    "CN": "Chine", "JP": "Japon", "IN": "Inde", "BR": "Brésil",
    "RU": "Russie", "AU": "Australie", "NG": "Nigéria", "ZA": "Afrique du Sud",
    "SN": "Sénégal", "CI": "Côte d'Ivoire", "ML": "Mali", "BF": "Burkina Faso",
    "NE": "Niger", "TD": "Tchad", "CM": "Cameroun", "CG": "Congo",
    "GA": "Gabon", "MA": "Maroc", "LY": "Libye", "SD": "Soudan",
    "ET": "Éthiopie", "KE": "Kenya", "GH": "Ghana", "BJ": "Bénin"
}

@router.get("/predict/{name}")
async def predict_nationality(name: str):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"https://api.nationalize.io/?name={name}")
            if resp.status_code != 200:
                raise HTTPException(502, "Service externe indisponible")
            data = resp.json()
            countries = data.get("country", [])
            for c in countries:
                c["country_name"] = COUNTRY_NAMES.get(c["country_id"], c["country_id"])
            return {
                "name": data["name"],
                "count": data["count"],
                "countries": countries[:5]
            }
    except httpx.RequestError:
        raise HTTPException(503, "Service API externe indisponible")
