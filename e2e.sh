#!/usr/bin/env bash
# End-to-end demo of the LeetCode Judge: create a problem, submit solutions,
# watch them get queued, executed in Docker, and judged.

PS=http://localhost:3000/api/v1   # Problem Service
SS=http://localhost:3001/api/v1   # Submission Service
ES=http://localhost:3002/api/v1   # Evaluator Service
TAG=$RANDOM

line(){ echo "------------------------------------------------------------"; }
hdr(){ echo; line; echo "  $1"; line; }

# Render the per-testcase verdict map into something humans can read.
render(){
  local verdicts; verdicts=$(echo "$1" | grep -oE '"(AC|WA|TLE|Error)"' | tr -d '"')
  local i=1 all_ac=1
  while read -r v; do
    [ -z "$v" ] && continue
    echo "        Testcase $i ............ $v"
    [ "$v" != "AC" ] && all_ac=0
    i=$((i+1))
  done <<< "$verdicts"
  if [ "$all_ac" = "1" ]; then echo "        >>> VERDICT: ACCEPTED";
  else echo "        >>> VERDICT: REJECTED"; fi
}

# Submit code, then walk through its lifecycle out loud.
run(){
  local label="$1" lang="$2" code="$3"
  echo
  echo "  >> Submission: $label   [language: $lang]"
  echo "     ----- code -----"
  printf '%b\n' "$code" | sed 's/^/       | /'
  echo "     ----------------"
  local sid; sid=$(curl -s -X POST $SS/submissions -H 'Content-Type: application/json' \
      -d '{"problemId":"'"$PID"'","language":"'"$lang"'","code":"'"$code"'"}' \
      | grep -o '"id":"[a-f0-9]*"' | head -1 | cut -d'"' -f4)
  echo "     [1] Submitted to Submission Service  ->  status: PENDING  (id=$sid)"
  echo "     [2] Job pushed onto the Redis queue  ->  waiting for the Evaluator..."
  echo "     [3] Evaluator picked it up, running the code inside a Docker container..."
  local data
  for i in $(seq 1 15); do
    data=$(curl -s $SS/submissions/$sid)
    echo "$data" | grep -q '"status":"completed"' && break
    sleep 2
  done
  echo "     [4] Evaluation complete -> verdict written back to the submission:"
  render "$data"
}

hdr "LeetCode Judge - End-to-End Demo"

hdr "STEP 1/4  -  Health check (all three microservices)"
printf "  Problem Service    (3000) : %s\n" "$(curl -s $PS/ping/health)"
printf "  Submission Service (3001) : %s\n" "$(curl -s $SS/ping/health)"
printf "  Evaluator Service  (3002) : %s\n" "$(curl -s $ES/ping/health)"

hdr "STEP 2/4  -  Create a problem (Problem Service)"
PID=$(curl -s -X POST $PS/problems -H 'Content-Type: application/json' -d '{
  "title":"Square a Number '"$TAG"'","description":"Read an integer n and print n*n.","difficulty":"easy",
  "testcases":[{"input":"6","output":"36"},{"input":"5","output":"25"}]}' \
  | grep -o '"id":"[a-f0-9]*"' | head -1 | cut -d'"' -f4)
echo "  Title      : Square a Number $TAG"
echo "  Difficulty : easy"
echo "  Testcases  : input 6 -> expect 36   |   input 5 -> expect 25"
echo "  Created OK -> PROBLEM_ID = $PID"

hdr "STEP 3/4  -  Submit solutions against that problem"
run "Correct Python"  python 'n=int(input())\nprint(n*n)'
run "Wrong Python"    python 'n=int(input())\nprint(n+n)'
run "Correct C++"     cpp    '#include <iostream>\nusing namespace std;\nint main(){int n;cin>>n;cout<<n*n<<endl;return 0;}'

hdr "STEP 4/4  -  All submissions recorded for this problem"
COUNT=$(curl -s $SS/submissions/problem/$PID | grep -o '"id":"[a-f0-9]*"' | wc -l)
echo "  Submission Service has $COUNT submissions stored for PROBLEM_ID $PID"

curl -s -X DELETE $PS/problems/$PID >/dev/null
echo
echo "  Demo finished. (cleaned up problem $PID)"
echo
