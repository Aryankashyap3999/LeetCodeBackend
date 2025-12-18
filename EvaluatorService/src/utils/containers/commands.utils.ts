export const commands = {
    python: function(code: string) {
        const runCommand = `echo '${code}' > solution.py && python3 solution.py`;
        return ['/bin/sh', '-c', runCommand];
    }
}