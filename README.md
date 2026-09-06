

# ⚡ CS2 CLONE ⚡

### 🎯 Многопользовательский тактический 3D-шутер в стиле Counter-Strike 2
### 🎯 Multiplayer Tactical 3D Shooter inspired by Counter-Strike 2

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Babylon.js](https://img.shields.io/badge/Babylon.js-7.0-DD0031?style=for-the-badge&logo=webgl&logoColor=white)
![Colyseus](https://img.shields.io/badge/Colyseus-0.15-orange?style=for-the-badge&logo=socketdotio&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[🇷🇺 Русская версия](#-русская-версия) • [🇬🇧 English Version](#-english-version)

---

# 🇷🇺 РУССКАЯ ВЕРСИЯ

> 🔥 Полноценный клон Counter-Strike 2 с мультиплеером, ботами и античитом 🔥

## 📖 Описание

**CS2 Clone** — это многопользовательский тактический 3D-шутер, созданный с использованием современных веб-технологий. Игра поддерживает мультиплеер до 10 игроков, умных ботов, реалистичную баллистику, экономику как в оригинальной CS и полноценное мобильное управление.

## ✨ Особенности

### 🎮 Геймплей

- ✅ Мультиплеер **5v5** (CT vs T)
- ✅ Раундовая система как в CS
- ✅ Экономика и покупка оружия
- ✅ **8 видов оружия** с реалистичной баллистикой
- ✅ Система отдачи и разброса
- ✅ Хедшоты с уроном x4

### 🤖 Боты и ИИ

- ✅ **4 уровня сложности** ботов
- ✅ Умный поиск врагов
- ✅ Реалистичная стрельба с ошибками прицеливания
- ✅ Команды через консоль

### 🛡️ Античит

- 🏃 Speed Hack Detection
- 🌀 Teleport Detection
- ❤️ Health Hack Detection
- 🔫 Rapid Fire Detection
- 🎯 Aimbot Detection

### 📱 Мобильная поддержка

- 🕹️ Виртуальный джойстик
- 👆 Тач-управление обзором
- 🔘 Кнопки действий
- ⚡ Оптимизация производительности

## 🚀 Быстрый старт

### Требования

- Node.js **18+**
- npm **9+**

### Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/mixailneAI/Counter-Strike-2-TypeScript-Version.git
cd Counter-Strike-2-TypeScript-Version

# 2. Установите зависимости клиента
npm install

# 3. Установите зависимости сервера
cd server && npm install && cd ..

# 4. Запустите игру
npm run dev:all
```

### 🌐 Адреса

| Сервис | Адрес |
|--------|-------|
| 🎮 Клиент | `http://localhost:3000` |
| 📊 Мониторинг сервера | `http://localhost:2567/colyseus` |

## 🕹️ Управление

### 💻 ПК

| Клавиша | Действие |
|---------|----------|
| `W A S D` | Движение |
| `Мышь` | Обзор |
| `ЛКМ` | Стрельба |
| `ПКМ` | Прицеливание |
| `R` | Перезарядка |
| `Space` | Прыжок |
| `Shift` | Бег |
| `C` | Присесть |
| `B` | Меню покупки |
| `Tab` | Таблица счёта |
| `` ` `` / `ё` | **Консоль разработчика** |

### 📱 Мобильные устройства

| Элемент | Действие |
|---------|----------|
| Левый джойстик | Движение |
| Правая часть экрана | Обзор |
| 🔫 | Стрельба |
| ⬆️ | Прыжок |
| 🔄 | Перезарядка |
| 🏃 | Бег |

## 💻 Консоль разработчика

Откройте консоль клавишей `` ` `` или `ё` и введите команды:

```bash
# === БОТЫ ===
bot_add_t [name]         # Добавить бота за террористов
bot_add_ct [name]        # Добавить бота за спецназ
bot_kick [name|all]      # Кикнуть бота(ов)
bot_difficulty <0-3>     # Сложность: Easy/Normal/Hard/Expert

# === ЧИТЫ (требуется sv_cheats 1) ===
sv_cheats 1              # Включить читы
god                      # Бессмертие
noclip                   # Полёт сквозь стены
give ak47                # Выдать оружие
impulse 101              # Все оружия + деньги

# === НАСТРОЙКИ МАТЧА ===
mp_roundtime <1-9>       # Время раунда (минуты)
mp_startmoney <0-16000>  # Стартовые деньги
mp_restartgame [sec]     # Перезапуск игры

# === УТИЛИТЫ ===
status                   # Статус игры
kill                     # Убить себя
disconnect               # Отключиться
help                     # Список команд
clear                    # Очистить консоль
```

## 🗺️ Карта

**de_dust2_clone** — упрощённая версия легендарной карты:

- 🏠 Спавны CT и T
- 🎯 Сайты A и B
- 📦 Укрытия и ящики
- 🧱 Стены и перегородки

## 🏗️ Архитектура проекта

```
cs2-clone/
├── shared/              # Общие типы и константы
├── server/              # Сервер (Colyseus)
│   └── src/
│       ├── rooms/       # Игровые комнаты
│       ├── systems/     # Боевая система, раунды, боты, экономика
│       └── entities/    # Игрок, снаряды
└── client/              # Клиент (Vue 3 + Babylon.js)
    └── src/
        ├── core/        # Движок, сеть, ввод, консоль, античит, звук
        ├── systems/     # Игроки, оружие, карта, эффекты
        └── components/  # HUD, меню, покупка, счёт, мобильное управление
```

## 🛠️ Технологии

| Категория | Технологии |
|-----------|------------|
| **Frontend** | Vue 3, Pinia, Tailwind CSS |
| **3D движок** | Babylon.js |
| **Физика** | Cannon-es |
| **Сеть** | Colyseus, Socket.io |
| **Аудио** | Howler.js |
| **Сборка** | Vite, Rollup |

---

# 🇬🇧 ENGLISH VERSION

> 🔥 A full-featured Counter-Strike 2 clone with multiplayer, bots and anti-cheat 🔥

## 📖 Description

**CS2 Clone** is a multiplayer tactical 3D shooter built with modern web technologies. The game supports up to 10 players, smart bots, realistic ballistics, CS-like economy and full mobile controls.

## ✨ Features

### 🎮 Gameplay

- ✅ **5v5** Multiplayer (CT vs T)
- ✅ CS-like round system
- ✅ Economy & weapon buying
- ✅ **8 weapons** with realistic ballistics
- ✅ Recoil & spread system
- ✅ Headshots with x4 damage

### 🤖 Bots & AI

- ✅ **4 difficulty levels**
- ✅ Smart enemy detection
- ✅ Realistic shooting with aim errors
- ✅ Console commands

### 🛡️ Anti-Cheat

- 🏃 Speed Hack Detection
- 🌀 Teleport Detection
- ❤️ Health Hack Detection
- 🔫 Rapid Fire Detection
- 🎯 Aimbot Detection

### 📱 Mobile Support

- 🕹️ Virtual joystick
- 👆 Touch look controls
- 🔘 Action buttons
- ⚡ Performance optimization

## 🚀 Quick Start

### Requirements

- Node.js **18+**
- npm **9+**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mixailneAI/Counter-Strike-2-TypeScript-Version.git
cd Counter-Strike-2-TypeScript-Version

# 2. Install client dependencies
npm install

# 3. Install server dependencies
cd server && npm install && cd ..

# 4. Run the game
npm run dev:all
```

### 🌐 URLs

| Service | Address |
|---------|---------|
| 🎮 Client | `http://localhost:3000` |
| 📊 Server Monitor | `http://localhost:2567/colyseus` |

## 🕹️ Controls

### 💻 Desktop

| Key | Action |
|-----|--------|
| `W A S D` | Movement |
| `Mouse` | Look |
| `LMB` | Shoot |
| `RMB` | Aim |
| `R` | Reload |
| `Space` | Jump |
| `Shift` | Sprint |
| `C` | Crouch |
| `B` | Buy menu |
| `Tab` | Scoreboard |
| `` ` `` | **Developer console** |

### 📱 Mobile

| Element | Action |
|---------|--------|
| Left joystick | Movement |
| Right screen area | Look |
| 🔫 | Shoot |
| ⬆️ | Jump |
| 🔄 | Reload |
| 🏃 | Sprint |

## 💻 Developer Console

Open the console with `` ` `` and type commands:

```bash
# === BOTS ===
bot_add_t [name]         # Add a bot to Terrorists
bot_add_ct [name]        # Add a bot to Counter-Terrorists
bot_kick [name|all]      # Kick bot(s)
bot_difficulty <0-3>     # Difficulty: Easy/Normal/Hard/Expert

# === CHEATS (requires sv_cheats 1) ===
sv_cheats 1              # Enable cheats
god                      # Invincibility
noclip                   # Fly through walls
give ak47                # Give weapon
impulse 101              # All weapons + money

# === MATCH SETTINGS ===
mp_roundtime <1-9>       # Round time (minutes)
mp_startmoney <0-16000>  # Starting money
mp_restartgame [sec]     # Restart game

# === UTILITIES ===
status                   # Game status
kill                     # Suicide
disconnect               # Disconnect
help                     # Command list
clear                    # Clear console
```

## 🗺️ Map

**de_dust2_clone** — a simplified version of the legendary map:

- 🏠 CT & T spawns
- 🎯 Sites A & B
- 📦 Cover & crates
- 🧱 Walls & barriers

## 🛠️ Technologies

| Category | Technologies |
|----------|--------------|
| **Frontend** | Vue 3, Pinia, Tailwind CSS |
| **3D Engine** | Babylon.js |
| **Physics** | Cannon-es |
| **Network** | Colyseus, Socket.io |
| **Audio** | Howler.js |
| **Build** | Vite, Rollup |

---

## 📄 License / Лицензия

This project is licensed under the **MIT License** — created for educational purposes.

Этот проект распространяется под лицензией **MIT** — создан в образовательных целях.

---

### 💙 Made with love and 🔥 by the CS2 Clone Team
### 💙 Сделано с любовью и 🔥 командой CS2 Clone

![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

# ⚡ TypeScript Version

![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**This project is fully written in TypeScript for maximum type safety and developer experience.**

**Этот проект полностью написан на TypeScript для максимальной надёжности типов и удобства разработки.**

```
╔═══════════════════════════════════════╗
║   GLHF! See you on the battlefield!   ║
╚═══════════════════════════════════════╝
```
```
 
