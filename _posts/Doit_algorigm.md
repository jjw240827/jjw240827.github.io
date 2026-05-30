3 - 1 숫자의 합 구하기
백준 11720번

- 슈도코드
N값 입력받기

N길이의 숫자를 String으로 입력 받기

String으로 입력받은 숫자를 char[]로 바꾸기 -> String.toCharArray()

int sum 선언

for(char배열을 개수만큼 반복) {
    배열의 각 요소를 정수형으로 변환하여 sum에 누적하여 더하기
}

sum 출력

import java.util.Scanner;

public class main {
    public static void main(String[] args){
       Scanner sc = new Scanner(System.in);
       int N = sc.nextInt();
       String input = sc.next();
       char[] Nums = input.toCharArray();
       int sum = 0;
       for(int i = 0; i < Nums.length; i++) {
            sum += Nums[i] - '0';
            <!-- sum += Character.getNumericValue(Nums[i]); -->
       }
       System.out.print(sum);
    }
}

- 배운 것
1. 이렇게 여러 숫자들이 하나의 숫자로 들어올 때는 String으로 받아서 toCharArray 매서드로 char 배열에 하나씩 넣는다.
2. 문자를 숫자로 변환하려면 문자형 0을 빼는 것도 방법이다. 다른 방법으로는 sum += Character.getNumericValue(Nums[i]);가 있다.

3-2 평균 구하기

슈도코드

시험 과목 개수 N을 입력받기

int 배열 선언
N값 만큼 반복문으로 int 배열에 시험 성적 입력받기

int max 선언 -> double max 선언  

for(int 3배열.length) {
    max값보다 배열[i]값이 더 크면 값을 max에 집어넣기
}

double avg 선언
for(int 배열.length) {
    avg += (각 배열의 요소 / max * 100);
}

avg / int 배열.length

avg 출력하기

- 실제 코드
import java.util.Scanner;

public class main {
    public static void main(String[] args){

        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();

        int[] v = new int[N];
        for(int i = 0; i<N; i++){
            v[i] = sc.nextInt();
        }
        double max = 0;
        for(int i = 0; i<v.length; i++) {
            if(max < v[i]) {
                max = v[i];
            }
        }
        double avg = 0;
        for(int i =0; i<v.length; i++) {
            avg += (v[i] / max) * 100;
        }
        avg = avg / v.length;

        System.out.println(avg);
    }
}

- 틀린 이유
두자리 수 정수 / 100을 하면 소수가 되는데 이를 인지하지 못하고 int / int를 하여서 0이 되게 만들었음
int / double만 해도 값이 소수점이 되므로 max를 int에서 double로, avg를 int에서 double로 변경함

- 배운 것
1. 값을 재정의 하는 과정에서 소수점 숫자가 사용될 가능성이 있는지 체크해야 한다.
2. 책에서는 굳이 반복문을 2번 사용하지 않고 한 번에 max값과 sum 값을 동시에 확보하였다. 그 이후 출력할 때 수식을 넣어서 간단하게 코드를 작성하였다.

