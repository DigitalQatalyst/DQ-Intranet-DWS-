code = open("src/components/marketplace/MarketplacePage.tsx").read().split('\n')
level = 0
for i, line in enumerate(code):
    for char in line:
        if char == '{':
            level += 1
        elif char == '}':
            level -= 1
    if 1740 < i + 1 < 1780:
        print(f"{i+1:04d}: [{level}] {line}")
