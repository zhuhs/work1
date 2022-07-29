## Spring和Mybatis整合详解

### 官方主页
[Spring](https://docs.spring.io/spring/docs/5.0.12.RELEASE/spring-framework-reference/core.html#spring-core)

[Mybatis](http://www.mybatis.org/mybatis-3/zh/index.html)

### 概述

MyBatis-Spring 会帮助你将 MyBatis 代码无缝地整合到 Spring 中。 使用这个类库中的类, Spring 将会加载必要的MyBatis工厂类和 session 类。 这个类库也提供一个简单的方式来注入MyBatis数据映射器和SqlSession到业务层的bean中。 而且它也会处理事务, 翻译MyBatis的异常到Spring的 DataAccessException异常(数据访问异常,译者注)中。最终它并不会依赖于MyBatis,Spring或MyBatis-Spring来构建应用程序代码。

Hibernate是一个开源的对象关系映射框架。Mybatis是一款优秀的持久层框架。支持定制化SQL、存储过程以及高级映射。Mybatis避免了几乎所有的JDBC代码和手动设置参数以及获取结果集。

下面复制粘贴了一些Hibernate与MyBatis的异同：

Hibernate与MyBatis都可以是通过SessionFactoryBuider由XML配置文件生成SessionFactory，然后由SessionFactory 生成Session，最后由Session来开启执行事务和SQL语句。其中SessionFactoryBuider，SessionFactory，Session的生命周期都是差不多的。

Hibernate和MyBatis都支持JDBC和JTA事务处理。

Mybatis优势：

MyBatis可以进行更为细致的SQL优化，可以减少查询字段。
MyBatis容易掌握，而Hibernate门槛较高。

Hibernate优势：

Hibernate的DAO层开发比MyBatis简单，Mybatis需要维护SQL和结果映射。
Hibernate对对象的维护和缓存要比MyBatis好，对增删改查的对象的维护要方便。
Hibernate数据库移植性很好，MyBatis的数据库移植性不好，不同的数据库需要写不同SQL。
Hibernate有更好的二级缓存机制，可以使用第三方缓存。MyBatis本身提供的缓存机制不佳。

### 开始搭建

#### 依赖Jar包

```
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis</artifactId>
	<version>3.2.5</version>
</dependency>
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis-spring</artifactId>
	<version>1.3.0</version>
</dependency>
<!-- druid -->
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>druid</artifactId>
	<version>1.1.9</version>
</dependency>
```
MyBatis要依赖一个数据源。

#### spring-mybatis.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:tx="http://www.springframework.org/schema/tx" xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="
                    http://www.springframework.org/schema/beans
                    http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
                    http://www.springframework.org/schema/tx 
                    http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
                    http://www.springframework.org/schema/aop 
                    http://www.springframework.org/schema/aop/spring-aop-4.0.xsd
                    http://www.springframework.org/schema/context      
                    http://www.springframework.org/schema/context/spring-context-4.0.xsd">

	<bean id="annotationPropertyConfigurerMybatis"
		class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
		<property name="order" value="1" />
		<property name="ignoreUnresolvablePlaceholders" value="true" />
		<property name="locations">
			<list>
				<value>classpath:properties/db-config-test.properties</value>
			</list>
		</property>
	</bean>
	
	<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"
		init-method="init" destroy-method="close">
		<property name="driverClassName" value="${db.dirverClass}"></property>
		<property name="url" value="${db.url}" />
		<property name="username" value="${db.username}" />
		<property name="password" value="${db.password}" />

		<property name="initialSize" value="1" />
		<property name="minIdle" value="1" />
		<property name="maxActive" value="20" />

		<property name="maxWait" value="60000" />

		<property name="timeBetweenEvictionRunsMillis" value="60000" />

		<property name="minEvictableIdleTimeMillis" value="300000" />

		<property name="validationQuery" value="SELECT 1" />
		<property name="testWhileIdle" value="true" />
		<property name="testOnBorrow" value="false" />
		<property name="testOnReturn" value="false" />

		<property name="poolPreparedStatements" value="true" />
		<property name="maxPoolPreparedStatementPerConnectionSize"
			value="20" />

		<property name="filters" value="stat" />
	</bean>

	<bean id="transactionManager"
		class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="dataSource"></property>
	</bean>

	<tx:annotation-driven transaction-manager="transactionManager" />

	<!-- jdbcTemplate -->
	<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
		<property name="dataSource" ref="dataSource"></property>
	</bean>

	<!-- mybatis -->
	<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
		<property name="dataSource" ref="dataSource" />
		<property name="configLocation" value="classpath:mybatis/mybatis-config.xml" />
		<property name="mapperLocations" value="classpath:mybatis/mapper/*.xml" />
	</bean>
	<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
		<property name="basePackage" value="cn.pomit.springwork.mybatis.mapper" />
	</bean>
</beans>
```
spring-mybatis.xml配置了数据源及mybatis的配置和映射文件。spring-mybatis.xml配置完成后，只需要在spring的配置文件中
```<import resource="classpath*:spring-mybatis.xml"/>```
即可

DB配置文件：

```
db.url=jdbc:mysql://127.0.0.1:3306/cff?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC
db.username=cff
db.password=123456
db.dirverClass=com.mysql.cj.jdbc.Driver
```

#### Mybatis的配置

mybatis-config.xml：

```
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">  
<configuration> 
<settings>    
        <setting name="logImpl" value="LOG4J" />      
    </settings> 
</configuration>  
```

这里配置了Mybatis的日志打印方式。

#### Mybatis的映射文件

映射文件xml需要和配套的Mapper接口一起定义。

mybatis-appuser.xml:

```
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace=cn.pomit.springwork.mybatis.mapper.AppUserMapper">
	<resultMap id="BaseResultMap" type="cn.pomit.springwork.model.security.AppUser">
		<result column="uuid" property="uuid" />
		<result column="user_name" property="userName" />
		<result column="passwd" property="password" />
		<result column="user_type" property="userType" />
		<result column="user_no" property="userNo" />
	</resultMap>
	<sql id="Base_Column_List">
		uuid, user_name, passwd, user_type,user_no
	</sql>
	<select id="getAppUser" resultMap="BaseResultMap" parameterType="java.lang.String">
		select
		<include refid="Base_Column_List" />
		from se_app_user
		where user_no = #{userNo}
	</select>
	
	<select id="getAppUserByType" resultMap="BaseResultMap" parameterType="java.lang.String">
		select
		<include refid="Base_Column_List" />
		from se_app_user
		where user_type = #{userType}
	</select>
	
	<select id="getAppUserByUserName" resultMap="BaseResultMap" parameterType="java.lang.String">
		select
		<include refid="Base_Column_List" />
		from se_app_user
		where user_name = #{userName}
	</select>
	
	<insert id="save" parameterType="cn.pomit.springwork.model.security.AppUser">
		insert into se_app_user(uuid, user_name, passwd, user_type,user_no) 
			value(
			#{uuid},
			#{userName},
			#{password},
			#{userType},
			#{userNo}
			)
	</insert>
	
	<update id="modify" parameterType="com.cff.springwork.model.security.AppUser">
		update se_app_user
		<set>
			<if test="password != null">passd=#{password}</if>
		</set>
		where user_name=#{userName}
	</update>

</mapper>  
```

Mapper接口：
```
package cn.pomit.springwork.mybatis.mapper;

import java.util.List;

import cn.pomit.springwork.model.security.AppUser;

public interface AppUserMapper {
	public List<AppUser> getAppUser(String userNo);
	
	public List<AppUser> getAppUserByType(String userType);
	
	public List<AppUser> getAppUserByUserName(String userName);
	
	public void save(AppUser appUser);
	
	public void modify(AppUser appUser);
	
}
```

#### Service调用

以上配置完成后，就可以直接调用Mapper了，当然，只能是Spring的bean调用，毕竟Mapper只是个接口，它是由Spring生成代理来调用的。

AppUserService：

```
package cn.pomit.springwork.mybatis.service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.pomit.springwork.common.constant.Constant;
import cn.pomit.springwork.model.security.AppUser;
import cn.pomit.springwork.mybatis.mapper.AppUserMapper;

@Service
@Transactional
public class AppUserService {
	@Autowired
	AppUserMapper appUserMapper;

	@Autowired
	AppSeqService appSeqService;

	public void save(AppUser appUser) {
		String uuid = UUID.randomUUID().toString().replace("-", "");
		appUser.setUuid(uuid);
		appUser.setUserNo(appSeqService.nextSeq(Constant.USERSEQ));
		appUser.setUserType(Constant.USERTYPE);
		appUserMapper.save(appUser);
	}

	public AppUser findByName(String userName) {
		List<AppUser> appusers = appUserMapper.getAppUserByUserName(userName);
		if (appusers == null || appusers.size() < 1) {
			return null;
		}
		return appusers.get(0);
	}
	
	public List<AppUser> findByType(String userType) {
		List<AppUser> appusers = appUserMapper.getAppUserByType(userType);
		if (appusers == null || appusers.size() < 1) {
			return null;
		}
		return appusers;
	}

	public boolean modify(AppUser user) {
		try {
			appUserMapper.modify(user);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
}
```


### 快速构建项目
[Spring组件化构建](https://www.pomit.cn/java/spring/spring.html)