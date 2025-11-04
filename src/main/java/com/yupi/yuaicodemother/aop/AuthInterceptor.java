package com.yupi.yuaicodemother.aop;

import com.yupi.yuaicodemother.annotation.AuthCheck;
import com.yupi.yuaicodemother.exception.BusinessException;
import com.yupi.yuaicodemother.exception.ErrorCode;
import com.yupi.yuaicodemother.exception.ThrowUtils;
import com.yupi.yuaicodemother.model.entity.User;
import com.yupi.yuaicodemother.model.enums.UserRoleEnum;
import com.yupi.yuaicodemother.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static com.yupi.yuaicodemother.exception.ErrorCode.NO_AUTH_ERROR;

@Aspect
@Component
public class AuthInterceptor {

    @Resource
    private UserService userService;

    /**
     * 执行拦截
     *
     * @param joinPoint 切入点
     * @param authCheck 权限校验注解
     * @return
     * @throws Throwable
     */
    @Around("@annotation(authCheck)")
    public Object doInterceptor(ProceedingJoinPoint joinPoint, AuthCheck authCheck) throws Throwable {
        String mustRole = authCheck.mustRole();
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        HttpServletRequest httpServletRequest = ((ServletRequestAttributes) requestAttributes).getRequest();
        //判断该方法是否需要对应权限
        if (mustRole == null) {
            joinPoint.proceed();
        }
        //后续为需要权限
        User loginUser = userService.getLoginUser(httpServletRequest);
        String userRole = loginUser.getUserRole();
        ThrowUtils.throwIf(userRole == null, NO_AUTH_ERROR);
        //如果用户是管理员则继续执行
        if (userRole.equals(UserRoleEnum.ADMIN.getValue())) {
            return joinPoint.proceed();
        }
        //如果用户不是管理员则判断权限
        if (!userRole.equals(mustRole)) {
            throw new BusinessException(NO_AUTH_ERROR);
        }
        return joinPoint.proceed();
    }
}