package cn.pomit.springwork.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import cn.pomit.springwork.mybatis.domain.UserInfo;

@Mapper
public interface UserInfoMapper {
	@Select({
		"<script>",
	        "SELECT ",
	        "user_name as userName,passwd,name,mobile,valid,user_type as userType",
	        "FROM user_info",
	        "WHERE user_name = #{userName,jdbcType=VARCHAR}",
	   "</script>"})
	UserInfo findByUserName(@Param("userName") String userName);
	
	@Select({
        "<script>",
            "SELECT user_name as userName,passwd,name,mobile,valid,user_type as userType",
            "FROM user_info",
       "</script>"})
    List<UserInfo> selectAll();

    @Update({
        "<script>",
        " update user_info set",
        " passwd = #{passwd, jdbcType=VARCHAR}",
        " where user_name=#{userName}",
        "</script>"
    })
    int update(@Param("userName") String userName, @Param("passwd") String passwd);

    @Delete({
        "<script>",
        " delete from user_info",
        " where user_name=#{userName}",
        "</script>"
    })
    int delete(@Param("userName") String userName);
}
