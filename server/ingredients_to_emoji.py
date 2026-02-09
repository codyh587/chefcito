#!/usr/bin/env python3
import json
import sys
from difflib import SequenceMatcher
from pathlib import Path


EMOJI_DATABASE = {
    # Fruits
    "🍎": ["apple", "red apple"],
    "🍏": ["green apple", "granny smith"],
    "🍊": ["orange", "tangerine", "mandarin"],
    "🍋": ["lemon"],
    "🍌": ["banana"],
    "🍉": ["watermelon"],
    "🍇": ["grapes", "grape"],
    "🍓": ["strawberry", "strawberries"],
    "🫐": ["blueberry", "blueberries"],
    "🍈": ["melon", "honeydew"],
    "🍒": ["cherry", "cherries"],
    "🍑": ["peach", "peaches"],
    "🥭": ["mango", "mangoes"],
    "🍍": ["pineapple"],
    "🥥": ["coconut"],
    "🥝": ["kiwi", "kiwifruit"],
    "🍐": ["pear"],
    "🍋‍🟩": ["lime"],
    "🫒": ["olive", "olives"],
    "🍆": ["eggplant", "aubergine"],
    "🥑": ["avocado"],
    "🫚": ["ginger", "ginger root"],
    "🍅": ["tomato", "tomatoes"],
    # Vegetables
    "🥦": ["broccoli"],
    "🥬": [
        "leafy green",
        "lettuce",
        "cabbage",
        "bok choy",
        "greens",
        "kale",
        "spinach",
        "collard greens",
    ],
    "🥒": ["cucumber", "pickle"],
    "🌶️": ["chili", "hot pepper", "chile", "jalapeno", "cayenne", "pepper"],
    "🫑": ["bell pepper", "pepper", "capsicum", "sweet pepper"],
    "🌽": ["corn", "maize", "corn on the cob"],
    "🥕": ["carrot", "carrots"],
    "🧄": ["garlic", "garlic clove"],
    "🧅": ["onion", "onions"],
    "🥔": ["potato", "potatoes", "spud"],
    "🍠": ["sweet potato", "yam"],
    "🫛": ["pea", "peas", "pod", "green peas"],
    "🫘": ["beans", "legumes"],
    "🍄": ["mushroom", "mushrooms", "fungi"],
    "🌾": ["grain", "wheat", "rice sheaf", "barley", "oats"],
    "🥜": ["peanut", "peanuts"],
    "🌰": ["chestnut", "nut"],
    # Nuts & Seeds
    "🥜": ["peanut", "peanuts", "groundnut"],
    "🌰": ["chestnut", "nut"],
    "🌻": ["sunflower seeds", "seeds"],
    # Breads & Baked Goods
    "🍞": ["bread", "loaf", "toast", "sliced bread"],
    "🥐": ["croissant", "pastry"],
    "🥖": ["baguette", "french bread", "bread"],
    "🫓": ["flatbread", "pita", "naan", "tortilla", "roti", "chapati"],
    "🥨": ["pretzel"],
    "🥯": ["bagel"],
    "🥞": ["pancake", "pancakes", "hotcakes"],
    "🧇": ["waffle", "waffles"],
    "🥐": ["croissant"],
    "🍩": ["donut", "doughnut"],
    # Dairy & Eggs
    "🧀": ["cheese", "cheddar", "mozzarella", "parmesan", "swiss"],
    "🥚": ["egg", "eggs"],
    "🍳": ["fried egg", "cooking", "sunny side up"],
    "🧈": ["butter"],
    "🥛": ["milk", "glass of milk", "dairy"],
    "🍼": ["milk", "baby bottle", "formula"],
    "🧋": ["bubble tea", "boba", "milk tea"],
    "🥛": ["yogurt", "milk", "dairy drink"],
    # Snacks & Dairy Products
    "🍿": ["popcorn"],
    "🥨": ["pretzel"],
    "🍘": ["rice cracker", "crackers"],
    "🥮": ["mooncake"],
    "🥠": ["fortune cookie"],
    "🍪": ["cookie", "biscuit", "crackers"],
    "🧀": ["cheese", "cheese wedge"],
    "🥜": ["nuts", "peanuts", "trail mix"],
    "🍯": ["honey"],
    "🥫": ["canned food", "can", "soup can", "beans"],
    "🥣": ["bowl", "cereal", "yogurt", "oatmeal", "porridge"],
    "🍿": ["chips", "popcorn", "crisps"],
    # Meat & Protein
    "🍖": ["meat", "beef", "pork", "lamb", "ribs"],
    "🍗": ["poultry", "chicken", "turkey", "drumstick", "chicken leg"],
    "🥩": ["steak", "cut of meat", "beef", "ribeye", "sirloin"],
    "🥓": ["bacon", "pork belly"],
    "🌭": ["hot dog", "sausage", "frankfurter", "wiener"],
    "🦴": ["bone", "meat bone"],
    "🍖": ["ham", "meat on bone"],
    "🥩": ["meat", "red meat"],
    # Seafood
    "🦀": ["crab", "crab meat"],
    "🦞": ["lobster"],
    "🦐": ["shrimp", "prawn"],
    "🦑": ["squid", "calamari"],
    "🦪": ["oyster", "clam", "shellfish"],
    "🐟": ["fish", "salmon", "tuna", "cod"],
    "🐠": ["tropical fish"],
    "🐡": ["blowfish", "fugu", "pufferfish"],
    "🦈": ["shark"],
    "🐙": ["octopus", "tako"],
    "🍤": ["shrimp", "prawn", "fried shrimp", "tempura"],
    "🍥": ["fish cake", "narutomaki", "kamaboko"],
    # Fast Food & Prepared Foods
    "🍔": ["burger", "hamburger", "cheeseburger"],
    "🍟": ["fries", "french fries", "chips", "potato fries"],
    "🍕": ["pizza", "slice", "pepperoni"],
    "🥪": ["sandwich", "sub", "hoagie"],
    "🌮": ["taco", "tacos"],
    "🌯": ["burrito", "wrap"],
    "🥙": ["stuffed flatbread", "falafel", "gyro", "kebab", "shawarma"],
    "🧆": ["falafel", "chickpea"],
    "🫔": ["tamale", "tamales"],
    "🥗": ["salad", "greens", "caesar salad", "green salad"],
    "🍱": ["bento", "rice", "lunch box"],
    "🥡": ["takeout", "chinese takeout"],
    # Asian Cuisine
    "🍘": ["rice cracker", "senbei"],
    "🍙": ["rice ball", "onigiri"],
    "🍚": ["rice", "cooked rice", "white rice", "steamed rice"],
    "🍛": ["curry", "japanese curry", "curry rice"],
    "🍜": ["noodles", "ramen", "pasta", "noodle soup"],
    "🍝": ["spaghetti", "pasta"],
    "🍢": ["oden", "skewered food"],
    "🍣": ["sushi", "sashimi", "nigiri"],
    "🍡": ["dango", "mochi"],
    "🥟": ["dumpling", "gyoza", "potsticker", "dim sum", "wonton"],
    "🥮": ["mooncake"],
    "🍱": ["bento box", "lunch"],
    # Soups & Stews
    "🍲": ["pot of food", "soup", "broth", "stew", "hot pot"],
    "🥘": ["paella", "stew", "casserole", "one pot meal"],
    "🫕": ["fondue", "cheese fondue", "chocolate fondue"],
    "🥣": ["bowl of food", "soup bowl", "cereal bowl"],
    # Sweets & Desserts
    "🍦": ["ice cream", "soft serve", "frozen yogurt"],
    "🍧": ["shaved ice", "snow cone", "kakigori"],
    "🍨": ["ice cream", "gelato", "sundae"],
    "🍩": ["donut", "doughnut", "glazed donut"],
    "🍪": ["cookie", "biscuit", "chocolate chip cookie"],
    "🎂": ["cake", "birthday cake", "layer cake"],
    "🍰": ["cake", "shortcake", "slice of cake", "strawberry cake"],
    "🧁": ["cupcake", "muffin"],
    "🥧": ["pie", "apple pie", "fruit pie"],
    "🍫": ["chocolate", "chocolate bar", "candy bar"],
    "🍬": ["candy", "sweet", "hard candy"],
    "🍭": ["lollipop", "sucker"],
    "🍮": ["custard", "flan", "pudding", "creme caramel"],
    "🍯": ["honey", "honeypot"],
    "🧁": ["cupcake", "fairy cake"],
    "🍡": ["dango", "sweet dumplings", "mochi balls"],
    # Condiments & Spreads
    "🧂": ["salt", "table salt", "seasoning"],
    "🧈": ["butter", "margarine"],
    "🍯": ["honey", "syrup", "sweetener"],
    "🫙": ["jar", "jam", "preserves", "peanut butter", "nutella"],
    "🧄": ["garlic", "seasoning"],
    "🌶️": ["hot sauce", "spicy", "chili sauce"],
    "🥫": ["ketchup", "sauce", "canned goods"],
    # Beverages - Hot
    "☕": ["coffee", "tea", "hot beverage", "espresso", "cappuccino", "latte"],
    "🫖": ["teapot", "tea", "kettle"],
    "🍵": ["tea", "green tea", "matcha", "hot tea"],
    "☕": ["hot chocolate", "cocoa", "hot drink"],
    # Beverages - Cold & Soft Drinks
    "🥤": ["soda", "soft drink", "cola", "pop", "fizzy drink"],
    "🧃": ["juice box", "juice", "fruit juice"],
    "🧋": ["bubble tea", "boba", "milk tea", "pearl tea"],
    "🧊": ["ice", "ice cube", "iced"],
    "🥛": ["milk", "chocolate milk", "dairy"],
    "🧉": ["yerba mate", "mate"],
    "🥤": ["smoothie", "milkshake", "frappe"],
    "🫗": ["pouring liquid", "water", "beverage"],
    # Beverages - Alcoholic
    "🍾": ["champagne", "sparkling wine", "prosecco"],
    "🍷": ["wine", "red wine", "white wine"],
    "🍸": ["cocktail", "martini", "mixed drink"],
    "🍹": ["tropical drink", "mai tai", "pina colada"],
    "🍺": ["beer", "lager", "ale", "draft"],
    "🍻": ["beers", "cheers", "toast"],
    "🥂": ["champagne glasses", "toast", "celebration"],
    "🥃": ["whiskey", "bourbon", "scotch", "tumbler", "rum", "vodka"],
    "🍶": ["sake", "rice wine", "japanese sake"],
    "🧉": ["mate", "yerba"],
    # Utensils & Kitchen Items
    "🥄": ["spoon", "tablespoon", "teaspoon"],
    "🍴": ["fork and knife", "cutlery", "silverware"],
    "🥢": ["chopsticks"],
    "🔪": ["knife", "kitchen knife", "chef knife"],
    "🫗": ["pouring liquid", "pour"],
    "🍽️": ["plate", "fork and knife with plate", "dinner plate"],
    "🥣": ["bowl"],
    "🥫": ["can", "tin"],
    "🫙": ["jar", "container"],
    "🧂": ["salt shaker", "pepper shaker"],
    "🫕": ["fondue pot"],
    "🫖": ["teapot", "kettle"],
    # Containers & Packaging
    "🥫": ["can", "tin", "canned food"],
    "🫙": ["jar", "mason jar", "container"],
    "🧃": ["juice box", "drink box"],
    "🥡": ["takeout box", "to-go container"],
    "🍱": ["bento box", "lunch box"],
    "🍶": ["bottle", "sake bottle"],
    "🍾": ["bottle", "wine bottle"],
    "🧋": ["cup", "bubble tea cup"],
    "🥤": ["cup", "soda cup"],
}


def fuzzy_match_score(str1, str2):
    s1 = str1.lower().strip()
    s2 = str2.lower().strip()

    if s1 == s2:
        return 1.0

    if s1 in s2 or s2 in s1:
        return 0.9

    return SequenceMatcher(None, s1, s2).ratio()


def find_best_emoji_match(ingredient):
    best_score = 0
    best_emoji = "🍽️"  # Default fallback emoji

    ingredient_lower = ingredient.lower().strip()

    for emoji, keywords in EMOJI_DATABASE.items():
        for keyword in keywords:
            score = fuzzy_match_score(ingredient_lower, keyword)
            if score > best_score:
                best_score = score
                best_emoji = emoji

    return best_emoji, best_score


def process_ingredients(input_file, output_file=None, threshold=0.5):
    with open(input_file, "r", encoding="utf-8") as f:
        ingredients = json.load(f)

    if not isinstance(ingredients, list):
        print("Error: JSON file must contain an array of strings")
        sys.exit(1)

    results = {}
    unmatched = []

    print(f"Processing {len(ingredients)} ingredients...\n")

    for ingredient in ingredients:
        emoji, score = find_best_emoji_match(ingredient)

        if score >= threshold:
            results[ingredient] = emoji
        else:
            results[ingredient] = "🍽️"
            unmatched.append(ingredient)

    print(f"\n{'='*60}")
    print(f"Matched: {len(ingredients) - len(unmatched)}/{len(ingredients)}")
    if unmatched:
        print(f"Low confidence matches: {len(unmatched)}")
        print("Consider manually assigning emojis for:", ", ".join(unmatched[:5]))

    if output_file:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\nResults saved to: {output_file}")

    return results


def main():
    if len(sys.argv) < 2:
        print(
            "Usage: python ingredients_to_emoji.py <input.json> [output.json] [threshold]"
        )
        print(
            "\nExample: python ingredients_to_emoji.py ingredients.json results.json 0.5"
        )
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5

    if not Path(input_file).exists():
        print(f"Error: File '{input_file}' not found")
        sys.exit(1)

    process_ingredients(input_file, output_file, threshold)


if __name__ == "__main__":
    main()
