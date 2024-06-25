import requests
from bs4 import BeautifulSoup
import json

def scrape_standings():
    link = "https://onefootball.com/en/competition/premier-league-9/table"
    source = requests.get(link).text
    page = BeautifulSoup(source, "lxml")
    tab = page.select("[class*='standings__teamName']")

    table = []

    for row in tab:
        table.append(row.text.strip())

    return table

if __name__ == "__main__":
    standings = scrape_standings()
    print(json.dumps(standings))