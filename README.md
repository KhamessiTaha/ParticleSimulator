# Particle Simulator

A particle simulation game with various elements such as powder, water, fire, steam, and wood. Users can create particles and interact with them in a physics-based environment.

## Features

- Powder, Water, Fire, Steam, and Wood elements
- Physics-based interactions           
- Element creation through a user interface

## Requirements

- Python 3.7+
- Pygame
- NumPy

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/ParticleSimulator.git
    cd ParticleSimulator
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Run the application:
    ```bash
    python src/ui.py
    ```

## Building the Executable

To build the application as a standalone executable, run:
```bash
pyinstaller --name ParticleSimulator --onefile src/ui.py
