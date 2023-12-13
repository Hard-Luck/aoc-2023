from functools import cache


@cache
def can_place(string, number_hashtags):
    if number_hashtags > len(string):
        return False
    for i in range(number_hashtags):
        if not (string[i] == "#" or string == "?"):
            return False
    return True


@cache
def fiveTimesInput(string):
    return "".join([string, "?", string, "?", string, "?", string, "?", string])


def fiveTimesInstructions(string):
    return "".join([string, ",", string, ",", string, ",", string, ",", string])


@cache
def countRemainingTags(string):
    return string.count("#")


@cache
def splitInstructions(string):
    locs, orders = string.split(" ")
    return locs, [int(x) for x in orders.split(",")]


@cache
def get_total(input):
    m, orders = splitInstructions(input)
    if not orders or not m:
        return 0
    hashtags = orders[0]
    if hashtags > len(m):
        return 0


def part2():
    input = []
    with open("input.txt") as f:
        for line in f:
            input.append(line.replace("\n", ""))
    formatted = []
    for i in input:
        formatted.append(i.split(" "))
    enlarged = [
        " ".join([fiveTimesInput(x[0]), fiveTimesInstructions(x[1])]) for x in formatted
    ]
    total = 0
    enlarged.sort(key=lambda x: len(x[0]))
    print(get_total("??? 1"))


part2()
