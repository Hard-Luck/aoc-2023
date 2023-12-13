## get input
## five times both
## cache
## check permutations including can place
## sum them
from functools import cache

import re


@cache
def can_place(string, number_hashtags):
    if number_hashtags > len(string):
        return False
    for i in range(number_hashtags):
        if string[i] != "#" and string[i] != "p":
            return False
    return True


@cache
def fiveTimesInput(string):
    return string * 5


@cache
def fiveTimesInstructions(arrayOfNum: list):
    instruction = []
    for i in range(5):
        instruction = instruction + arrayOfNum
    return instruction


@cache
def countRemainingTags(string):
    regex = re.compile(r"#")
    return len(regex.findall(string))


@cache
def splitInstructions(string):
    line = string.split(" ")
    orders = line[1].split(",")
    locs = line[0]
    return locs, [int(x) for x in orders]


@cache
def getTotal(input, position=0):
    locs, orders = splitInstructions(input)
    tagsRemaining = sum(orders)
    if countRemainingTags(locs) > tagsRemaining:
        return 0
    total = 0
    numOfHashTags = orders[position]
    if len(locs) == 0:
        return 0
    if position == len(orders) - 1:
        for i in range(len(locs)):
            if can_place(locs[i:], numOfHashTags):
                if countRemainingTags(locs[i + numOfHashTags :] == 0):
                    total += 1

            if locs[i] == "#":
                return total

    else:
        if can_place(locs, numOfHashTags):
            total += getTotal(input[numOfHashTags + 1 :], position + 1)
        i = 1
        if locs[0] == "#":
            return total
        total += getTotal(input[i:], position)
    return total


print(getTotal("p###pppppppp 3,2,1"))
