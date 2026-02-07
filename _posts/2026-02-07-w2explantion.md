---
title:  "w2 정리, 요약"
date: 2026-02-04
categories: [git, github, Web]
---

하나의 흐름으로 코드를 이해하지 못하고 개별적으로 이해하는 것 같아서 정리 시간의 필요성을 느끼게 됨.

## domain(vo)

domain(Vo)는 데이터를 저장하는 db와 직접적으로 연결되어져 있는 클래스로써 값 자체를 나타내는 클래스이다. vo는 값 자체를 의미하므로 setter와 같이 값을 변경시키는 매서드는 지양해야하고, 두 객체의 필드 값이 같다면 모두 같은 객체로 만드는 것이 핵심이다. 

두 객체의 필드 값이 같다면 모두 같은 객체라는 뜻은 vo를 사용하여 테이블의 데이터를 표현할 때 학생 id등의 식별자 필드등이 있는 테이블을 사용하더라도 식별자도 하나의 필드로써 바라보고 모든 필드의 값이 맞으면 같은 객체로 판단된다고 이해하였다.
 프로젝트에서 데이터를 나타내는 클래스 중에 dto도 존재하는데 dto는 서로 다른 계층간의 이동에서 사용하는 데이터 객체이며, 순수한 데이터이다. dto를 사용해서 계층간의 데이터 전송, 데이터 수정등을 함으로써 vo의 불변성을 지킬 수 있다.

그렇다면 vo와 entity는 무슨차이일까?
entity는 DB 테이블과 1:1로 매핑이 되는 객체로, pk로 객체를 식별한다. 하지만 vo는 특정 식별자 없이 속성값 전체가 곧 그 객체의 정체성이다. 

vo의 핵심인 두 객체의 필드 값이 같다면 같은 객체이다. 를 위해서 equals와 hashcode()매서드를 오버라이딩해야 한다고 한다. 하지만 현재 w2 프로젝트의 vo는 entity로써 사용이 되는 느낌이여서 책의 진도를 계속 따라가보고 마지막까지 코드의 내용의 수정이 없다면 혼자서 수정 해볼 것 같다.

## login process

/login url과 매핑되어진 LoginController를 통해서 로그인 서비스 로직을 처리하며, get요청 시에는 login.jsp로 getRequestDispatcher를 하고 post요청 시에는 req 파라미터로 가져온 mid, mpw로 그와 맞는 테이블의 행값을 가져온다.(MemberService.login) login메서드에서는 dao.getWithPassword를 통해 mid와 mpw에 대한 값을 테이블에서 가져온다. dao.getWithPassword는 mid와 mpw에 해당하는 테이블값을 가져오는 로직으로 db와 직접적으로 연결하여 값을 가져온다. 

### dao를 통한 db와의 연결 과정

 @Cleanup Connection connection = ConnectionUtil.INSTANCE.getConnection();
        @Cleanup PreparedStatement preparedStatement =
                connection.prepareStatement(query);
        preparedStatement.setString(1, mid);
        preparedStatement.setString(2, mpw);

        @Cleanup ResultSet resultSet = preparedStatement.executeQuery();

        resultSet.next();

        memberVO = MemberVO.builder()
                .mid(resultSet.getString(1))
                .mpw(resultSet.getString(2))
                .mname(resultSet.getString(3))
                .build();

        return memberVO;

우선 @Cleanup은 try-catch문을 사용하지 않고 자동적으로 자원을 해체시키는 롬복 라이브러리에서 제공하는 어노테이션이다. connection은 커넥션 풀에 있는 여러 connection들 중 하나의 커넥션을 가져오는 것인데 

#### connectionUtil
public enum ConnectionUtil {

    INSTANCE;

    private HikariDataSource ds; 
// enum에서는 생성자가 자동으로 private로 지정된다.
    ConnectionUtil()  {
        HikariConfig config = new HikariConfig();      // 연결들의 설정 정보를 저장하는 객체
        config.setDriverClassName("org.mariadb.jdbc.Driver");   // db와 연결을 위해 사용하는 드라이버 이름
        config.setJdbcUrl("jdbc:mariadb://localhost:3307/webdb"); // db서버의 주소
        config.setUsername("webuser");  // db서버 접속 권한을 가진 사용자의 계정 정보
        config.setPassword("kim61640");
        config.addDataSourceProperty("cachePrepStmts", "true");  // 한 번 쓴 쿼리는 기억해두는 코드. 사용하는 sql을 계속해서
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

        ds = new HikariDataSource(config); // 설정한 내용을 바탕으로 실제 커넥션 풀을 생성, 여러 개의 커넥션을 만들고 풀에 담아둠
    }

    public Connection getConnection()throws Exception {
        return ds.getConnection();
    }

}

Hikaricp 즉 hikari connection pool은 여러 연결들을 미리 만들어 보관하다가 dao에서 getConnection을 호출 시, 연결을 반환해주고 작업을 마치면 close()로 다시 풀로 연결을 회수해가는 기능의 라이브러리이다.  
HikariConfig는 db연결을 위한 연결 정보들을 저장하는 객체이며, 
Hikari에서 제공하는 hikariDatasource는 자바 애플리케이션과 db 사이에서 연결을 관리하는 역할을 한다. config에 적혀있는 내용을 바탕으로 연결을 미리 여러 개 만들어 두고, dao과 연결이 필요할 때 getConnection을 하여서 연결을 보내준다. 작업을 마치면 말했던대로 close()로 연결을 회수하는 역할을 한다.

그러므로 만약 @cleanup을 안쓴다라면 connection.close를 통해서 반납을 해주어야 한다.

getConnection앞에 INSTANCE를 쓴 이유는 connectionutil이 enum객체 즉, 자바 애플리케이션에서 하나의 객체로만 존재하기 때문에 호출할 때 INSTANCE를 붙여야 한다.

prepareStatement로 db에 미리 사용할 sql을 전달하고 값을 받아와서 MemberVo builder를 통해 값을 넣는다.
#### builder 패턴
builer 어노테이션을 설정하면 MemberVO클래스 안에 똑같은 필드를 가진 MemberBuilder라는 내부 정적 클래스가 만들어진다.
그 후 .mid, .mpw등을 호출하여서 내부 정적 클래스에 값을 넣고 마지막에 .build를 호출하면 값을 memberVo 생성자에 집어넣어서 실제 객체는 딱 한 번 생성이 된다. 이를 통해서 setter와 다르게 불변성을 유지할 수 있게된다.


### mapperUtil
ModelMapper는 서로 다른 클래스의 객체 사이에서 데이터를 복사할 때, 개발자가 일일이 get.., set...을 하지 않아도 이름과 타입이 유사하면 자동으로 값을 매핑해주는 라이브러리이다.
enum을 쓴 이유는 자원을 많이 쓰는 객체이고 특성상 하나의 객체로도 충분하기 때문이다.

 MemberDTO memberDTO = modelMapper.map(vo, MemberDTO.class); 이렇게 vo를 Dto로 한 번에 변환시킨다.4


auto는 사용자가 자동 로그인 박스를 체크했으면 rememberMe에 True를 주는 장치이다.
True이면 uuid를 만들어서 자동 로그인에 사용한다. uuid란? Universally Unique Identifier로 범용 고유 식별자이다.
UUID.randomUUID()은 UUID에서 제공하는 정적 메서드로 중복이 없는 난수를 생성해고 toString을 통해 생성한 128비트 숫자 덩어리를 DB에 저장하기 쉬운 문자열 형태로 변환한다.

그 후 updateUuid로 해당 사용자 정보에 uuid를 추가하고 나중에 세션에 저장을 할 memberDTO에도 uuid를 넣어준다. 그 후 cookie에 uuid를 넣어서 브라우저에게 resp할 때 보내주고  session에도 uuid를 포함한 member정보를 저장한다.

?? 왜 session과 db에 둘 다 저장하는가 둘 중 하나에만 저장하여서 대조하면 되지 않는가?
기본적으로 자동 로그인 시에 대조되는 정보는 db에 있는 정보이고 세션은 어차피 브라우저가 꺼지면 저장한 값을 없애기 때문에 자동 로그인에 적합하지 않다. session에 정보를 넣는 이유는 list보기 글쓰기 등을 하는 모든 순간에 db에 있는 정보로 대조를 하면 비효율적이기 때문에 로그인 이후에 사용된다. 이 코드가 Filter로써 존재하지만 아직까진 대조하지는 않고 단순히 session에 memberDTO가 들어있는가만 확인하는 방식으로 사용한다.