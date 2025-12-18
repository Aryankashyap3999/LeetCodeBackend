const bashConfig = ['/bin/sh', '-c'];

export const commands = {
    python: function(code: string) {
        const runCommand = `echo '${code}' > solution.py && python3 solution.py`;
        return [...bashConfig, runCommand];
    },
    cpp: function(code: string) {
        const runCommand = `echo '${code}' > mkdir app && cd app && echo '${code}' > solution.cpp && g++ solution.cpp -o solution && ./solution`;
        return [...bashConfig, runCommand];
    }
}