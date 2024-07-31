from enum import Enum

class ElementType(Enum):
    EMPTY = 0
    POWDER = 1
    WATER = 2
    FIRE = 3
    STEAM = 4
    WOOD = 5

class Element:
    def __init__(self, type, color, flammable=False):
        self.type = type
        self.color = color
        self.flammable = flammable

ELEMENTS = {
    ElementType.EMPTY: Element(ElementType.EMPTY, (255, 255, 255)),
    ElementType.POWDER: Element(ElementType.POWDER, (128, 128, 128)),
    ElementType.WATER: Element(ElementType.WATER, (0, 0, 255)),
    ElementType.FIRE: Element(ElementType.FIRE, (255, 0, 0)),
    ElementType.STEAM: Element(ElementType.STEAM, (192, 192, 192)),
    ElementType.WOOD: Element(ElementType.WOOD, (139, 69, 19), flammable=True),
}
