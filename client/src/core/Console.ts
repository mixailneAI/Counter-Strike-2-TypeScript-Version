import { useGameStore } from '../stores/gameStore';
import { NetworkManager } from './NetworkManager';
import { WEAPONS } from '../../../../shared/constants';

interface ConsoleCommand {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[]) => void;
  requiresCheats?: boolean;
}

export class Console {
  private isOpen = false;
  private history: string[] = [];
  private historyIndex = -1;
  private commands = new Map<string, ConsoleCommand>();
  private cheatsEnabled = false;

  private consoleElement: HTMLDivElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private outputElement: HTMLDivElement | null = null;

  constructor(private networkManager: NetworkManager) {
    this.registerCommands();
    this.createConsoleUI();
    this.setupKeyboardListener();
  }

  private registerCommands() {
    this.registerCommand({
      name: 'bot_add_t',
      description: 'Add a bot to Terrorist team',
      usage: 'bot_add_t [name]',
      execute: (args) => {
        const name = args[0] || `Bot_T_${Math.floor(Math.random() * 1000)}`;
        this.networkManager.sendConsoleCommand('bot_add_t', { name });
        this.print(`✅ Bot "${name}" added to Terrorists`);
      },
    });

    this.registerCommand({
      name: 'bot_add_ct',
      description: 'Add a bot to Counter-Terrorist team',
      usage: 'bot_add_ct [name]',
      execute: (args) => {
        const name = args[0] || `Bot_CT_${Math.floor(Math.random() * 1000)}`;
        this.networkManager.sendConsoleCommand('bot_add_ct', { name });
        this.print(`✅ Bot "${name}" added to Counter-Terrorists`);
      },
    });

    this.registerCommand({
      name: 'bot_kick',
      description: 'Kick a bot from the game',
      usage: 'bot_kick [name|all]',
      execute: (args) => {
        const target = args[0] || 'all';
        this.networkManager.sendConsoleCommand('bot_kick', { target });
        this.print(`✅ Bot "${target}" kicked`);
      },
    });

    this.registerCommand({
      name: 'bot_difficulty',
      description: 'Set bot difficulty',
      usage: 'bot_difficulty <0-3>',
      execute: (args) => {
        const difficulty = parseInt(args[0]);
        if (difficulty < 0 || difficulty > 3) {
          this.print('❌ Invalid difficulty. Use 0-3');
          return;
        }
        this.networkManager.sendConsoleCommand('bot_difficulty', { difficulty });
        const names = ['Easy', 'Normal', 'Hard', 'Expert'];
        this.print(`✅ Bot difficulty: ${names[difficulty]}`);
      },
    });

    this.registerCommand({
      name: 'kill',
      description: 'Commit suicide',
      usage: 'kill',
      execute: () => {
        this.networkManager.sendConsoleCommand('kill');
        this.print('💀 You committed suicide');
      },
    });

    this.registerCommand({
      name: 'disconnect',
      description: 'Disconnect from server',
      usage: 'disconnect',
      execute: () => {
        this.networkManager.disconnect();
        this.print('🔌 Disconnected from server');
      },
    });

    this.registerCommand({
      name: 'status',
      description: 'Show game status',
      usage: 'status',
      execute: () => {
        const store = useGameStore();
        this.print('=== GAME STATUS ===');
        this.print(`Round: ${store.currentRound}`);
        this.print(`Score: CT ${store.ctScore} - ${store.tScore} T`);
        this.print(`Phase: ${store.state}`);
        this.print(`Cheats: ${this.cheatsEnabled ? 'ENABLED' : 'DISABLED'}`);
      },
    });

    this.registerCommand({
      name: 'sv_cheats',
      description: 'Enable/disable cheats',
      usage: 'sv_cheats <0|1>',
      execute: (args) => {
        const value = args[0];
        if (value === '1') {
          this.cheatsEnabled = true;
          this.print('⚠️ Cheats ENABLED');
        } else if (value === '0') {
          this.cheatsEnabled = false;
          this.print('✅ Cheats DISABLED');
        } else {
          this.print(`sv_cheats = ${this.cheatsEnabled ? '1' : '0'}`);
        }
      },
    });

    this.registerCommand({
      name: 'god',
      description: 'Toggle god mode',
      usage: 'god',
      requiresCheats: true,
      execute: () => {
        if (!this.checkCheats()) return;
        this.print('🛡️ God mode toggled');
      },
    });

    this.registerCommand({
      name: 'noclip',
      description: 'Toggle noclip',
      usage: 'noclip',
      requiresCheats: true,
      execute: () => {
        if (!this.checkCheats()) return;
        this.print('✈️ Noclip toggled');
      },
    });

    this.registerCommand({
      name: 'give',
      description: 'Give weapon',
      usage: 'give <weapon_name>',
      requiresCheats: true,
      execute: (args) => {
        if (!this.checkCheats()) return;
        const weapon = args[0];
        if (!weapon) {
          this.print('❌ Usage: give <weapon_name>');
          return;
        }
        if (!WEAPONS[weapon]) {
          this.print(`❌ Unknown weapon: ${weapon}`);
          return;
        }
        this.networkManager.sendConsoleCommand('give', { weapon });
        this.print(`🔫 Given: ${WEAPONS[weapon].name}`);
      },
    });

    this.registerCommand({
      name: 'clear',
      description: 'Clear console output',
      usage: 'clear',
      execute: () => {
        if (this.outputElement) {
          this.outputElement.innerHTML = '';
        }
      },
    });

    this.registerCommand({
      name: 'help',
      description: 'Show all commands',
      usage: 'help [command]',
      execute: (args) => {
        if (args[0]) {
          const cmd = this.commands.get(args[0]);
          if (cmd) {
            this.print(`\n=== ${cmd.name} ===`);
            this.print(`Description: ${cmd.description}`);
            this.print(`Usage: ${cmd.usage}`);
            if (cmd.requiresCheats) {
              this.print('⚠️ Requires sv_cheats 1');
            }
          } else {
            this.print(`❌ Unknown command: ${args[0]}`);
          }
        } else {
          this.print('\n=== AVAILABLE COMMANDS ===\n');
          this.commands.forEach((cmd) => {
            const cheatMark = cmd.requiresCheats ? ' ⚠️' : '';
            this.print(`${cmd.name.padEnd(20)} - ${cmd.description}${cheatMark}`);
          });
        }
      },
    });

    this.registerCommand({
      name: 'echo',
      description: 'Print text to console',
      usage: 'echo <text>',
      execute: (args) => {
        this.print(args.join(' '));
      },
    });
  }

  private registerCommand(command: ConsoleCommand) {
    this.commands.set(command.name, command);
  }

  private createConsoleUI() {
    this.consoleElement = document.createElement('div');
    this.consoleElement.className = 'fixed top-0 left-0 w-full h-1/2 bg-black/95 text-green-400 font-mono text-sm z-[9999] hidden flex-col';
    this.consoleElement.style.fontFamily = 'Consolas, Monaco, monospace';

    const header = document.createElement('div');
    header.className = 'bg-gray-900 px-4 py-2 border-b border-green-500/30 flex justify-between items-center';
    header.innerHTML = `
      <span class="text-green-400 font-bold">CS2 DEVELOPER CONSOLE</span>
      <span class="text-gray-500 text-xs">Press ~ to close</span>
    `;
    this.consoleElement.appendChild(header);

    this.outputElement = document.createElement('div');
    this.outputElement.className = 'flex-1 overflow-y-auto px-4 py-2';
    this.consoleElement.appendChild(this.outputElement);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'bg-gray-900 px-4 py-2 border-t border-green-500/30 flex items-center gap-2';

    const prompt = document.createElement('span');
    prompt.className = 'text-green-400';
    prompt.textContent = '>';

    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = 'flex-1 bg-transparent outline-none text-green-400';
    this.inputElement.spellcheck = false;
    this.inputElement.autocomplete = 'off';

    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(this.inputElement!.value);
        this.inputElement!.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });

    inputContainer.appendChild(prompt);
    inputContainer.appendChild(this.inputElement);
    this.consoleElement.appendChild(inputContainer);

    document.body.appendChild(this.consoleElement);

    this.print('=== CS2 Clone Developer Console ===');
    this.print('Type "help" for available commands');
    this.print('');
  }

  private setupKeyboardListener() {
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~' || e.key === 'ё' || e.key === 'Ё') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  private toggle() {
    this.isOpen = !this.isOpen;

    if (this.consoleElement) {
      if (this.isOpen) {
        this.consoleElement.classList.remove('hidden');
        this.consoleElement.classList.add('flex');
        this.inputElement?.focus();
      } else {
        this.consoleElement.classList.add('hidden');
        this.consoleElement.classList.remove('flex');
        this.inputElement?.blur();
      }
    }
  }

  private executeCommand(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return;

    this.history.push(trimmed);
    this.historyIndex = this.history.length;

    this.print(`> ${trimmed}`);

    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = this.commands.get(commandName);

    if (command) {
      try {
        command.execute(args);
      } catch (error) {
        this.print(`❌ Error: ${error}`);
      }
    } else {
      this.print(`❌ Unknown command: ${commandName}`);
    }
  }

  private navigateHistory(direction: number) {
    if (this.history.length === 0) return;

    this.historyIndex += direction;
    this.historyIndex = Math.max(0, Math.min(this.history.length, this.historyIndex));

    if (this.inputElement) {
      this.inputElement.value = this.historyIndex === this.history.length
        ? ''
        : this.history[this.historyIndex];
    }
  }

  private autocomplete() {
    if (!this.inputElement) return;

    const current = this.inputElement.value.toLowerCase();
    const matches = Array.from(this.commands.keys()).filter(cmd =>
      cmd.startsWith(current)
    );

    if (matches.length === 1) {
      this.inputElement.value = matches[0];
    } else if (matches.length > 1) {
      this.print('\nAvailable:');
      matches.forEach(cmd => this.print(`  ${cmd}`));
    }
  }

  private print(message: string) {
    if (!this.outputElement) return;

    const line = document.createElement('div');
    line.className = 'whitespace-pre-wrap';
    line.textContent = message;
    this.outputElement.appendChild(line);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  private checkCheats(): boolean {
    if (!this.cheatsEnabled) {
      this.print('❌ This command requires sv_cheats 1');
      return false;
    }
    return true;
  }

  isOpened(): boolean {
    return this.isOpen;
  }

  dispose() {
    this.consoleElement?.remove();
  }
}