code = open("src/pages/marketplace/MarketplaceDetailsPage.tsx").read()
level = 0
for i, char in enumerate(code):
    if char == '{':
        level += 1
    elif char == '}':
        level -= 1
        if level < 0:
            print(f"Extra '}}' found around character index {i}")
            # print surrounding code
            start = max(0, i-50)
            end = min(len(code), i+50)
            print(f"Context: {code[start:end]}")
            level = 0 # reset to continue finding more
print(f"Final nesting level: {level}")
