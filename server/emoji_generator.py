from difflib import SequenceMatcher


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
    "🌶️": [
        "chili",
        "hot pepper",
        "chile",
        "jalapeno",
        "cayenne",
        "pepper",
        "hot sauce",
        "spicy",
        "chili sauce",
    ],
    "🫑": ["bell pepper", "pepper", "capsicum", "sweet pepper"],
    "🌽": ["corn", "maize", "corn on the cob"],
    "🥕": ["carrot", "carrots"],
    "🧅": ["onion", "onions"],
    "🥔": ["potato", "potatoes", "spud"],
    "🍠": ["sweet potato", "yam"],
    "🫛": ["pea", "peas", "pod", "green peas"],
    "🫘": ["beans", "legumes"],
    "🍄": ["mushroom", "mushrooms", "fungi"],
    "🌾": ["grain", "wheat", "rice sheaf", "barley", "oats"],
    "🌰": ["chestnut", "nut"],
    # Nuts & Seeds
    "🥜": ["peanut", "peanuts", "groundnut", "nuts", "peanuts", "trail mix"],
    "🌻": ["sunflower seeds", "seeds"],
    # Breads & Baked Goods
    "🍞": ["bread", "loaf", "toast", "sliced bread"],
    "🥐": ["croissant", "pastry"],
    "🥖": ["baguette", "french bread", "bread"],
    "🫓": ["flatbread", "pita", "naan", "tortilla", "roti", "chapati"],
    "🥯": ["bagel"],
    "🥞": ["pancake", "pancakes", "hotcakes"],
    "🧇": ["waffle", "waffles"],
    "🍩": ["donut", "doughnut", "glazed donut"],
    # Dairy & Eggs
    "🧀": ["cheese", "cheddar", "mozzarella", "parmesan", "swiss", "cheese wedge"],
    "🥚": ["egg", "eggs"],
    "🍳": ["fried egg", "cooking", "sunny side up"],
    "🥛": ["milk", "glass of milk", "dairy", "yogurt", "milk", "dairy drink"],
    "🍼": ["baby bottle", "formula"],
    "🧋": ["bubble tea", "boba", "milk tea", "cup", "pearl tea"],
    # Snacks & Dairy Products
    "🥨": ["pretzel"],
    "🥮": ["mooncake"],
    "🥠": ["fortune cookie"],
    "🥫": [
        "canned food",
        "can",
        "soup can",
        "beans",
        "tin",
        "ketchup",
        "sauce",
        "canned goods",
    ],
    "🥣": [
        "bowl",
        "cereal",
        "yogurt",
        "oatmeal",
        "porridge",
        "bowl of food",
        "soup bowl",
        "cereal bowl",
    ],
    "🍿": ["chips", "popcorn", "crisps"],
    # Meat & Protein
    "🍖": ["meat", "beef", "pork", "lamb", "ribs", "ham", "meat on bone"],
    "🍗": ["poultry", "chicken", "turkey", "drumstick", "chicken leg"],
    "🥩": ["steak", "cut of meat", "beef", "ribeye", "sirloin", "meat", "red meat"],
    "🥓": ["bacon", "pork belly"],
    "🌭": ["hot dog", "sausage", "frankfurter", "wiener"],
    "🦴": ["bone", "meat bone"],
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
    "🥟": ["dumpling", "gyoza", "potsticker", "dim sum", "wonton"],
    # Soups & Stews
    "🍲": ["pot of food", "soup", "broth", "stew", "hot pot"],
    "🥘": ["paella", "stew", "casserole", "one pot meal"],
    "🫕": ["fondue", "cheese fondue", "chocolate fondue"],
    # Sweets & Desserts
    "🍦": ["ice cream", "soft serve", "frozen yogurt"],
    "🍧": ["shaved ice", "snow cone", "kakigori"],
    "🍨": ["ice cream", "gelato", "sundae"],
    "🍪": ["cookie", "biscuit", "chocolate chip cookie", "crackers"],
    "🎂": ["cake", "birthday cake", "layer cake"],
    "🍰": ["cake", "shortcake", "slice of cake", "strawberry cake"],
    "🥧": ["pie", "apple pie", "fruit pie"],
    "🍫": ["chocolate", "chocolate bar", "candy bar"],
    "🍬": ["candy", "sweet", "hard candy"],
    "🍭": ["lollipop", "sucker"],
    "🍮": ["custard", "flan", "pudding", "creme caramel"],
    "🧁": ["cupcake", "fairy cake", "muffin"],
    "🍡": ["dango", "sweet dumplings", "mochi balls", "mochi"],
    # Condiments & Spreads
    "🧂": ["salt", "table salt", "seasoning", "pepper"],
    "🧈": ["butter", "margarine"],
    "🍯": ["honey", "syrup", "sweetener", "honeypot"],
    "🫙": [
        "jar",
        "jam",
        "preserves",
        "peanut butter",
        "nutella",
        "container",
    ],
    "🧄": ["garlic", "seasoning", "garlic clove"],
    # Beverages - Hot
    "☕": [
        "coffee",
        "tea",
        "hot beverage",
        "espresso",
        "cappuccino",
        "latte",
        "hot chocolate",
        "cocoa",
        "hot drink",
    ],
    "🫖": ["teapot", "tea", "kettle"],
    "🍵": ["tea", "green tea", "matcha", "hot tea"],
    # Beverages - Cold & Soft Drinks
    "🥤": [
        "soda",
        "soft drink",
        "cola",
        "pop",
        "fizzy drink",
        "smoothie",
        "milkshake",
        "frappe",
    ],
    "🧃": ["juice box", "juice", "fruit juice"],
    "🧊": ["ice", "ice cube", "iced"],
    "🫗": ["pouring liquid", "water", "beverage", "pour"],
    # Beverages - Alcoholic
    "🍾": ["champagne", "sparkling wine", "prosecco", "wine"],
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
    "🍽️": ["plate", "fork and knife with plate", "dinner plate"],
}


def fuzzy_match_score(str1, str2):
    s1 = str1.lower().strip()
    s2 = str2.lower().strip()

    if s1 == s2:
        return 1.0
    if s1 in s2 or s2 in s1:
        return 0.9

    return SequenceMatcher(None, s1, s2).ratio()


def find_best_food_emoji(*strings):
    best_score = 0
    best_emoji = "🍽️"  # Default fallback emoji

    for emoji, keywords in EMOJI_DATABASE.items():
        for keyword in keywords:
            for string in strings:
                string = string.lower()
                score = fuzzy_match_score(string, keyword)
                if score > best_score:
                    best_score = score
                    best_emoji = emoji

    return best_emoji, best_score
