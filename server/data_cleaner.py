import json
import re

# Load original dataset
RECIPES = []
with open("recipe1.json", encoding="utf-8") as f:
    for line in f:
        RECIPES.append(json.loads(line))

# Remove duplicates with same recipe name
names = set()
i = 0
noDupes = []
for item in RECIPES:
    if item["recipe_title"] in names:
        continue
    names.add(item["recipe_title"])
    noDupes.append(item)

print(len(names))
print(len(noDupes))
# with open("recipe2.jsonl", "w") as f:
#     for entry in noDupes:
#         print(json.dumps(entry), file=f)

# for simplicity sake, only ingredients
# with open("ingredients.jsonl", "w") as f:
#     for entry in noDupes:
#         print(json.dumps(entry["ingredients"]), file=f)

# clean ingredients list
ingredients = [entry["ingredients"] for entry in noDupes]
# first, remove numbers and fractions:
noNum = []
for entry in ingredients:
    result = [re.sub(r"\b\d+/\d+\b|\b\d+(\.\d+)?\b", "", text) for text in entry]
    noNum.append(result)
    # \b ... \b = boundary of words, \d+ = 1 or more digits, | = or, 2nd part gets rid of decimals

# with open("ingredients2.jsonl", "w") as f:
#     for entry in noNum:
#         print(json.dumps(entry), file=f)

# Next remove units

UNITS = [
    "cup",
    "cups",
    "tbsp",
    "tablespoon",
    "tablespoons",
    "tsp",
    "teaspoon",
    "teaspoons",
    "oz",
    "ounce",
    "ounces",
    "g",
    "kg",
    "ml",
    "l",
    "lb",
    "lbs",
    "pound",
    "pounds",
    "box",
    "fluid",
]

unit_regex = r"\b(" + "|".join(UNITS) + r")\b"
noUnits = []
for entry in noNum:
    result = [re.sub(unit_regex, "", text) for text in entry]
    noUnits.append(result)

# with open("ingredients3.jsonl", "w") as f:
#     for entry in noUnits:
#         print(json.dumps(entry), file=f)

# next remove phrases such as "to taste"
phrases_regex = r"\b(or\s+)?(to taste|as needed|as desired|to cover)\b"
noPhrases = []
for entry in noUnits:
    result = [re.sub(phrases_regex, "", text) for text in entry]
    noPhrases.append(result)
# Next remove parens and whatever they have inside
noParens = []
for entry in noPhrases:
    result = [
        re.sub(r"\([^)]*\)", "", text).strip() for text in entry
    ]  # remove things like "(bla bla bla)"
    result = [
        re.sub(r"^(.+?)\s*\(.*", "", text).strip() for text in result
    ]  # convert "sugar (or honey" -> "sugar"
    result = [re.sub(r"\(", "", text).strip() for text in result]  # remove remaining (
    result = [
        re.sub(r"^.*?\)\s*(.+)$", r"\1", text).strip() for text in result
    ]  # convert "-piece) chocolate" --> "chocolate"
    result = [re.sub(r"\)", "", text).strip() for text in result]  # remove remaining )
    noParens.append(result)

# Next remove those unicodes
noUnicodes = []
for entry in noParens:
    result = [
        re.sub(r"[^\x00-\x7F]", "", text).strip() for text in entry
    ]  # removes everything that isn't in ascii range x00 to x7f
    noUnicodes.append(result)

# with open("ingredients4.jsonl", "w") as f:
#     for entry in noUnicodes:
#         print(json.dumps(entry), file=f)

allIngredients = set()
for entry in noUnicodes:
    for ingredient in entry:
        allIngredients.add(ingredient.lower())

with open("ingredients.txt", "w") as f:  # list of all unique ingredients
    print("\n".join(allIngredients), file=f)
