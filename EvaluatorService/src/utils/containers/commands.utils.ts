const bashConfig = ['/bin/sh', '-c'];

export const commands = {
    python: function(code: string, input: string) {
        const runCommand = `echo '${code}' > solution.py && echo '${input}' > input.txt && python3 solution.py < input.txt`;
        return [...bashConfig, runCommand];
    },
    cpp: function(code: string, input: string) {
        const runCommand = `mkdir app && cd app && echo '${code}' > solution.cpp && echo '${input}' > input.txt && g++ solution.cpp -o solution && ./solution < input.txt`;
        return [...bashConfig, runCommand];
    }
}