---
title:  "spring"
date: 2026-02-09
categories: [git, github, java]
---

스프링 프레임워크는 자체적으로 객체를 생성하고 관리하면서 필요한 곳으로 객체를 주입하여 준다. 이때 이 기능을 사용하기 위해서라면 설정 파일이나 어노테이션을 이용해야 한다. 
>> XML설정을 이용할 것이다. root-context.xml을 spring 설정 파일 코드를 넣고 bean을 생성한다. bean은 spring이 관리하는 객체를 부르는 말이다.

sample이라는 패키지 아래에 임시 클래스를 만들고 test코드를 사용해서 test를 함. @Autowired는 빈이 만들어져 있는 객체를 해당 코드로 가져오는 어노테이션이다.

즉, 지금까지 한 것은 xml 파일을 이용하여 미리 객체를 만들고 그 객체를 원하는 코드에 넣는다. 왜 굳이 이렇게 하는가?
설명을 봤지만 아직은 이해가 잘 되지 않는다
#### ?? 왜 의존성 주입을 해야하는가?

applicationcontext는 스프링에서 빈들을 관리하는 곳이다. 세션 컨테이너는 브라우저, 사용자마다 공간을 할당하고, servlet 컨테이너 웹 어플리케이션이 시작할 때 생성되어 종료될 때까지 유지되며, 하나의 웹 앱 당 하나만 존재한다. 또한 모든 사용자와 서블릿이 공유하므로 설정이나 자원을 담을 때 사용한다.

우리가 servlet을 사용할 때 web.xml에서 servlet을 설정으로 명시할 수 있고, @WebServlet 어노테이션을 사용하여 지정할 수도 있 듯이 bean을 설정 파일에서 지정하는 방식 대신에

@Qualifier 생성자를 사용하면 @RequiredArgsConstructor를 같이 사용하면 안된다. @Require....은 final이 붙어 있는 필드를 매개변수로 하는 생성자를 자동으로 만들어주는 어노테이션인데, 문제는 qualifier보다 먼저 실행이 된다는 점이다. 그러므로 생성자가 만들어진 결가에 매개변수에 qualifer가 적용이 안되어서 어떤 객체를 넣을건지 WAS는 모르기 떄문이다

- 어플리케이션의 모든 객체를 스프링 프레임워크를 이용해서 객체를 생성하고 빈으로 처리하는가?
- XML, 어노테이션 2가지 방법을 사용하는 경우가 있는가?

<context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/root-context.xml</param-value>
    </context-param>

<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
web.xml은 was가 프로젝트를 실행할 때 서비스를 어떻게 돌려야 할지를 확인하는 첫 번째 지침서이다.
contextConfigLocation라는 이름을 쓰는 이유는 ContextLoaderListener라는 클래스 내부에 contextConfigLocation이라는 이름으로 저장된 값을 찾는 로직이 존재한다. 그리고 해당 이름으로 된 경로를 읽어서 객체를 생성한다.

ContextLoaderListener는 WAS가 구동되는 시점을 포작하여 contextConfigLocation 파라미터를 참조하여 root-context.xml의 위치를 찾는다. 그 후 ApplicationContext를 생성하고 메모리에 올린다. 그리고 root-context.xml에 적힌 대로 서비스, dao 객체들을 미리 생성하여 보관소에 담아둔다.


## mybatis

mybatis는 DB와 더 쉽게 상호작용할 수 있도록 도와주는 SQL 매퍼 프레임워크이다. DB에 연결하기 위해 w2에서 connectionpool과 그를 위한 설정 등을 생략하고 별도의 xml파일에 sql을 관리할 수 있다. 즉, sql코드와 프로그래밍 코드를 분리해서 구현한다.

<bean id ="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    	<property name="dataSource" ref="dataSource"/>
    </bean>

SqlSessionFactory 객체 생성. SqlSessionFactory란? Mybatis의 인터페이스로 DB 세션을 생성하는 역할을 한다. db연결을 위한 여러 설정 정보등을 바탕으로 sqlSession을 생성한다.
sqlsession은 각각의 db 작업에 대해 생성되어 사용한 후 닫혀야 한다. 마치 dbcp처럼 말이다.
<mybatis:scan base-package="org.zerock.springex.mapper"></mybatis:scan>

base-package에 지정된 경로에 있는 자바 인터페이스를 읽고 인터페이스를 실행할 수 있는 객체를 생성한다. 해당 인터페이스 기능을 가진 객체(구현체)를 해당 인터페이스를 주입받으려는 곳에 넣으면 db를 돌려서 값을 가져와준다. 인터페이스를 읽고 만약 어노테이션으로 정의된 인터페이스는 매서드 위의 sql을 실행하고, xml로 정의한 인터페이스는 xml에서 정의된 sql문을 찾아서 sql을 실행한다.

즉, mybatis를 쓰는 이유는 단순한 쿼리가 적혀있는 인터페이스만 만들고 인터페이스를 호출만 하면 인터페이스의 내용을 실행시켜 결과를 돌려주기 때문이다.

나는 mybatis의 어노테이션을 사용했다.

@Select("select now()")
   String getTime();

이메서드가 실행되면 mybatis는 db에 접속하여 select now()를 실행하고 결과를 String으로 반환한다. MyBatis의 select는 결과 데이터를 원하는 형태의 자바 타입으로 자동 변환해줍니다. 즉, String이 아니라 memberDAO로도 받을 수 있다는 뜻이다.

<bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource"
          destroy-method="close">
        <constructor-arg ref="hikariConfig" />
</bean>

bean을 만들 때 datasource라는 이름의 객체를 만든다. 객체로 만들 클래스는 class=""에 있는 클래스이고, 객체가 소멸될 때 close한다.
마지막으로 생성자로 객체를 만들 때 이전에 정의한 hikariConfig 빈을 참조한다.

<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.zerock.springex.mapper.TimeMapper2">

    <select id="getNow" resultType="string">
        select now()
    </select>

</mapper>
namespace의 해당 인터페이스의 매서드의 내용을 정의하는 파일이다. 인터페이스에는 아무런 정보가 존재하지 않고 메서드 이름만이 존재한다. 매서드의 내용을 Timemapper2설정파일에서 정의한다. 이러면 어노테이션 대신 xml파일로 매서드의 내용을 정의하면서 자바코드와 db코드의 분업화가 가능하다.

<bean id ="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <property name="mapperLocations" value="classpath:/mappers/**/*.xml"></property>
</bean>
위에서 설명한 것처럼 SqlSessionFactory는 db 세션을 생성하는 역할인데 2번째 property는 실제 SQL문이 들어있는 XML파일들의 위치를 알려주느 역할을 한다.

## web mvc


frontcontroller가 요청을 적절히 controller에게 보내기 위해서는 매핑이되어야한다. 이를 위해 RequestMapping을 사용한다. RequestMapping은 클래스내 메서드에 둘 다 사용할 수 있는데 예제 sampleController를 보면 이해가 된다. method를 지정할 수도 아니면 Get,PostMapping 어노테이션을 따로 사용할 수도 있다.

파라미터 자동수집기능이란? 브라우저에서 보낸 파라미터를 스프링이 자동으로 추출, 변환해서 채워주는 기능이다. 즉, request.getParameter로 일일이 호출해서 형 변환까지 하는 번거로움을 줄여준다.
만약 요청에 파라미터가 전달되지 않을 수 있다. 이를 위해 RequestParam이 존재한다. RequetParam은 defaultValue로 기본 값을 지정할 수 있다.

또한 모든 파라미터는 문자열로 전송이 되는데 날짜가 골치아프다. 날짜의 경우 2026-02-12 또는 2026/02/12 등 다양한 형식이 존재하므로 에러가 자주 발생한다. 이를 위해서 java.time의 LocalDate를 주로 파라미터로 사용한다. 하지만 이를 위해서는 LocalDateFormatter클래스가 필요하다. 이 객체는 문자열을 설정된 패턴의 날짜 문자열로 반환한다.

servlet-content에   org.springframework.format.support.FormattingConversionServiceFactoryBean객체를 만들고 내의 커스텀 설정을 준다. 그리고 스프링 mvc 전역 설정에 주입되어서 요청에 대한 컨트롤러가 실행되기 전 HandlerAdapter가 해당 매서드에 어떤 파라미터가 필요한지 확인 후 conversionservice에서 해당 파라미터를 처리할 도구를 찾고 적용시킨다.

일반적인 model 객체는 한 번의 요청 동안에만 유효하다. 하지만 리다이렉트를 쓰게되면 새로운 주소 즉, 새로운 요청을 하게 만드는 것이기에 model에 담은 데이터가 사라지게 된다.
이를 해결하기 위해 존재하는 것이 RedirectAttributes이다. 방식은 2가지가 존재한다. 첫 번째가 addAttribute이고 두 번째가 addFlashAttribute이다. addAttribute는 데이터를 추가하면 리다이렉트할 url에 쿼리 스트링으로 데이터가 추가되고, addFalshAttribute를 이용하면 url에는 보이지 않지만, jsp에서는 일회용으로 사용된다.

ex6을 get 요청해보면 처음에는 addFalsh값이 보이지만 새로고침을 하면 사라진다. 즉, 일회용이다.

그러면 forward를 사용하면 되지 않는가? 하지만 forward에는 문제가 있다. 브라우저는 자신의 주소가 바뀌었는지 모르고, model 객체는 유지된다. 하지만 새로고침 시에 게시물 등록 서비스같은 경우는 여러 번 반복해서 게시물을 등록할 수 있기 때문에 이런 경우 redirect를 사용해야 한다.

## 예외처리
@ControllerAdvice는 해당 클래스가 전역 예외 처리기임을 선언한다. 모든 컨트롤러의 예외를 감시하다가, 발생하면 이클래스의 매서드가 호출된다.
@ExceptionHandler(NumberFormatException.class)은 NumberFormatException의 전담 처리 매서드라고 선언하는 어노테이션이다.
NumberFormatException은 자바에서 문자열을 숫자로 바꿀려고 할 때, 문자열의 형식이 숫자로 바꿀 수 없을 때 발생하는 예외이다.

responsebody를 사용하면 컨트롤로에서 return으로 문자열을 반환하면 해당 이름의 jsp와 같은 뷰 템플릿을 찾으러 가는데, 그 대신에 브라우저 화면에 해당 문자열을 보여준다.

자바의 모든 클래스는 Exception를 상속받으므로 @ExceptionHandler(Exception.class)이 코드를 쓰게 되면 구체적인 예외 처리 매서드에서 걸러지지 않은 예외들을 이 매서드가 처리하게 된다.

서버 내부의 문제가 아닌 사용자가 잘못된 url을 호출하게 되면 404에러가 발생한다. 이럴 때는 매소드에 @ResopnseStatus를 이용하면 404 상태에 맞는 화면을 별도로 작성할 수 있다.

----

modelMapper를 스프링의 빈으로 등록하여서 DTO를 vo로 변환하거나 vo를 DTO로 변환하는 작업을 처리한다. ModelMapperConfig는 기존의 MapperUtil클래스르 스프링으로 변경한 버전으로 @Configuration을 이용한다.

2026-02-16
## mybatis, 스프링을 이용한 영속 처리
테스트 코드로 스프링의 주요 동작 과정과 필요한 부품들을 살펴보았다. 이젠 본격적으로 웹 어플리케이션을 만드는 섹션이다. 부트스트랩으로 test.html을 구현을 하였고, db와의 연동을 하려고 한다. 

------ 이렇게 자세하게 정리하는 것은 공부를 한 뒤 머리에 남는 것이 없는 기분이라서 자세하게 정리하면서 공부하려고 한다 --------

mybatis를 이용하는 개발 단계는
1. vo 선언
2. Mapper 인터페이스의 개발
3. XML의 개발
4. 테스트 코드의 개발 순서라고 한다.

todoVO는 5가지의 lombok의 어노테이션을 함께 사용하였다. 
- Getter : 자바에서 객체의 필드를 보호하기 위해서 private를 사용하는데 이러면 vo의 값을 밖으로 뺴올 수가 없다.. 이를 위한 매서드가 getter매서드인데 이 것을 어노테이션으로 대체한다.
- ToString : 출력시에 객체 안에 들어있는 값들을 한 눈에 보기 좋게 예쁘게 출력되게 하는 어노테이션이다. toString매서드를 대체하여 사용한다.
- AllArgsConstructor : 객체를 생성할 때 모든 필드 값을 채워서 한 번에 생성하고 싶을 때 사용된다.
- NoArgsConstructor : 빈 생성자 역할을 한다. 프레임워크에서는 내부적으로 객체를 생성할 때 이 빈 생성자를 찾는 경우가 많기 때문에 필요하다.
- Builder : 객체를 생성할 때 내가 원하는 값, 순서대로 넣어서 생성할 수 있게 해준다.

롬복은 객체 생성을 위한 단순한 코드 생성을 줄여주는 라이브러리이다. 자바 파일을 컴파일할 때, 롬복이 개입하여 실제 메서드 코드를 끼워 넣는다.

mybatis는 자바 코드와 sql문을 분리하여 사용가능하게 해주는 SQL 매퍼 프레임워크이다.

매퍼란 무엇인가? 매퍼란 과거에는 자바 코드안에 sql을 비롯한 db 연동을 위한 jdbc코드등을 넣어서 사용했었다. 하지만 지저분한 과정을 분리하여 자바 코드는 어떤 매서드만 실행할 것인지, xml은 자바 코드가 실행하는 매서드가 어떤 sql문인지를 정의해서 독립적으로 작성할 수 있게 해주는 자바 에플리케이션과 db사이의 통역사 같은 역할을 한다.

이를 구현하기 위해 TodoMapper, TodoMapper.xml 그리고 테스트를 위한 TodoMapperTests를 작성하였다.
XML을 작성할 때 namespace값은 인터페이스의 이름, 매서드의 이름은 select 태그의 i와 일치해야 한다.

test코드는 3가지의 어노테이션을 사용하였다.
- @Log4j2 : log 객체를 자동으로 생성하여 println대신 사용할 수 있다.
- @ExtendWith(SpringExtension.class) : 이제부터 해당 테스트 코드는 spring이 관리하는 기능을 사용한다는 선언이다.
- @ContextConfiguration(locations="file:src/main/webapp/WEB-INF/root-context.xml") : 테스트 코드가 실행할 때 어떤 설정 파일을 읽어야 하는지 알려준다.

- @Autowired(required = false) : required = false를 하지 않으면 TodoMapper는 인터페이스이기 때문에 오류가 뜰 수 있다.하지만 실제로는 mybatis가 실행 시점에 만들어 주기 때문에 false를 사용한다.
- @Test : test를 사용하면 main 매서드 없이도 매서드만 단독으로 실행 가능하고 코드를 즉석에서 확인할 수 있어서 사용한다.

#### 로그 레벨
로그에도 중요도에 따른 단계가 존재한다.
(낮음) TRACE > DEBUG > INFO > WARN > ERROR (높음)

<logger name="org.springframework" level="INFO" additivity="false">
            <appender-ref ref="console" />
</logger>
logger는 각 패키지별로 로그를 어떻게 남길지 정의한다.
name은 적용 대산 패키지, additivity flase는 상위 로거에게 전달하지 않게해서 중복을 막는다.
<appender-ref ref="console" />는 콘솔에 로그를 뿌리라는 명령이다.
<configuration status="INFO">는 lof4j2라이브러리 자체의 로그 시스템에 대한 정의이다.

<Appenders>
        <!-- 콜솔 -->
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout charset="UTF-8" pattern="%d{hh:mm:ss} %5p [%c] %m%n"/>
        </Console>
    </Appenders>
console이 무엇인지 정의하고, 출력될 때의 출력 방식과 설정을 정의한다.

## web.xml과 다른 설정 파일들의 관계
web.xml은 서버가 구동될 때 가장 먼저 읽히는 설정 파일이다.
web.xml의 context-param은 was가 구동될 때 이 설정을 읽어서 contextConfigLocation라는 이름으로 해당 경로를 servletcontext 저장소에 저장한다. root-context를 servletcontext에 저장.

listener는 웹 어플리케이션이 실행될 때 가장 먼저 실행되며,ContextLoaderListener은 servletcontext에 저장된 스프링 설정 파일(root-content)을 읽어서 Root ApplicationContext를 생성한다.

servletcontext는 웹 에플리케이션이 톰켓에 의해 구동될 때 생성되며, 프로젝트에서 단 하나만 존재한다. 서버가 켜질 때 생성되고, 꺼지거나 멈추면 소멸한다. 또한 모든 서블릿, 필터, 리스너가 이 객체를 공유한다.

Root ApplicationContext은 root-content를 보고 실제로 만들어진 부품 저장소이다.ContextLoaderListener가 서버 구동 시 이 저장소를 생성한다. 이 곳에 있는 빈들은 프로젝트 모든 곳에서 사용이 가능하다.
즉, servletcontent는 처음부터 존재하는 저장소이며, 설정파일을 공유한다. web.xml이 root-content를 servletcontent에 저장한다. 그리고 root-content에서 읽고 지정된 경로에서 객체(빈)을 만들어서 root applcationcontext에 저장하여 사용한다.
ContextLoaderListener가 자동으로 root applicationcontext를 만드는 라이브러리이다.

<servlet>
        <servlet-name>appServlet</servlet-name> <!-- servlet 이름 - frontservlet이다. -->
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param> <!-- 초기화 파라미터 디스패처 서블릿이 참고할 xml의 위치를 알려준다. -->
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/servlet-context.xml</param-value>
        </init-param>

        <init-param> <!-- 사용자가 없는 주소로 들어왔을 때, 예외를 발생시켜 사용자가 예외처리를 제어할 수 있게 한다. -->
            <param-name>throwExceptionIfNoHandlerFound</param-name>
            <param-value>true</param-value> <!-- true를 설정하면 컨트롤러를 못찾을 시 NoHandlerFoundException예외를 강제로 발생시켜
            @ExceptionHandler(NoHandlerFoundException.class)가 처리할 수 있게 된다. -->
        </init-param>


        <load-on-startup>1</load-on-startup> <!-- 서블릿을 톰켓 서버가 시작되는 즉시 메모리에 올리라는 명령 즉, 가장 먼저 만들어지는 
        서블릿 객체이다.-->
 </servlet>
	
<servlet-mapping>
        <servlet-name>appServlet</servlet-name>
        <url-pattern>/</url-pattern> <!-- 모든 요청에 대해서 appServlet이 먼저 받는다. 즉 frontcontroller이다. -->
</servlet-mapping>
은 front controller인 dispatcherServlet을 생성하고 매핑하는 설정 코드이다.
init-param은 서블릿이 생성될 때 전달되는 설정 값들이다. appservlet이라는 이름으로 frontcontrller가 생성된다. 생성된 controller는 자연스럽게 servletcontext에 저장된다.
contextConfigLocation은 dispatcherservlet이 자신의 일을 하기 위해 참고한 설정 파일의 위치를 알려준다.그 파일이 servlet-context이다.

dispatcherServlet안에는 throwExceptionIfNoHandlerFound이름의 필드가 미리 선언되어져 있다. 이 값이 true면 NoHandlerFoundException을 던지는 것이다. 코드에서는 해당 예외가 발생하면 custom404를 출력한다.

###

## 등록

- TodoMapper -> TodoService -> TodoController -> jsp순서

@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService

    private final TodoMapper todoMapper;

    private final ModelMapper modelMapper;

RequiredArgsConstructor은 필수 인자들을 포함하는 생성자를 만들어주는 어노테이션인다. 이때 필드에 final을 붙여서 필수 필드를 지정해줌으로써 생성자로 인해 한 번 생성되면 인자 객체가 바뀔 걱정도 없는 장점이 있다. 생성자가 하나만 존재하면 autowired를 생략해도 해당 생성자의 인자들을 채워준다.

