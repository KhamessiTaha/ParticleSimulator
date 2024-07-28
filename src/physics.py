# src/physics.py
import numpy as np
from elements import ELEMENTS, ElementType

class Grid:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.grid = np.full((width, height), ElementType.EMPTY, dtype=ElementType)

    def set_element(self, x, y, element_type):
        if 0 <= x < self.width and 0 <= y < self.height:
            self.grid[x, y] = element_type

    def get_element(self, x, y):
        if 0 <= x < self.width and 0 <= y < self.height:
            return self.grid[x, y]
        return ElementType.EMPTY

    def update(self):
        for x in range(self.width):
            for y in range(self.height - 2, -1, -1):
                element_type = self.grid[x, y]
                if element_type == ElementType.POWDER:
                    self.update_powder(x, y)
                elif element_type == ElementType.WATER:
                    self.update_water(x, y)
                elif element_type == ElementType.FIRE:
                    self.update_fire(x, y)
                elif element_type == ElementType.STEAM:
                    self.update_steam(x, y)
                elif element_type == ElementType.WOOD:
                    self.update_wood(x, y)

    def update_powder(self, x, y):
        if self.grid[x, y + 1] == ElementType.EMPTY:
            self.grid[x, y + 1] = ElementType.POWDER
            self.grid[x, y] = ElementType.EMPTY

    def update_water(self, x, y):
        if self.grid[x, y + 1] == ElementType.EMPTY:
            self.grid[x, y + 1] = ElementType.WATER
            self.grid[x, y] = ElementType.EMPTY
        elif x > 0 and self.grid[x - 1, y + 1] == ElementType.EMPTY:
            self.grid[x - 1, y + 1] = ElementType.WATER
            self.grid[x, y] = ElementType.EMPTY
        elif x < self.width - 1 and self.grid[x + 1, y + 1] == ElementType.EMPTY:
            self.grid[x + 1, y + 1] = ElementType.WATER
            self.grid[x, y] = ElementType.EMPTY

    def update_fire(self, x, y):
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if self.is_valid_position(nx, ny) and ELEMENTS[self.grid[nx, ny]].flammable:
                self.grid[nx, ny] = ElementType.FIRE

        if y > 0 and self.grid[x, y - 1] == ElementType.WATER:
            self.grid[x, y - 1] = ElementType.STEAM
        elif y > 0 and self.grid[x, y - 1] == ElementType.EMPTY:
            self.grid[x, y - 1] = ElementType.FIRE
            self.grid[x, y] = ElementType.EMPTY
        else:
            self.grid[x, y] = ElementType.EMPTY

    def update_steam(self, x, y):
        if y > 0 and self.grid[x, y - 1] == ElementType.EMPTY:
            self.grid[x, y - 1] = ElementType.STEAM
            self.grid[x, y] = ElementType.EMPTY
        elif y < self.height - 1 and self.grid[x, y + 1] == ElementType.WATER:
            self.grid[x, y] = ElementType.WATER

    def update_wood(self, x, y):
        if self.grid[x, y] == ElementType.FIRE:
            self.grid[x, y] = ElementType.EMPTY

    def is_valid_position(self, x, y):
        return 0 <= x < self.width and 0 <= y < self.height
