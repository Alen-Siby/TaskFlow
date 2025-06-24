package com.alen.todoapp.config;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.appender.ConsoleAppender;
import org.apache.logging.log4j.core.appender.RollingFileAppender;
import org.apache.logging.log4j.core.appender.rolling.DefaultRolloverStrategy;
import org.apache.logging.log4j.core.appender.rolling.SizeBasedTriggeringPolicy;
import org.apache.logging.log4j.core.config.LoggerConfig;
import org.apache.logging.log4j.core.layout.PatternLayout;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

@Configuration
public class AppConfig {

    @Bean
    public LoggerContext loggerContext() {
        try {
            // Ensure logs directory exists
            Files.createDirectories(Paths.get("logs"));

            // Get the logger context
            final LoggerContext context = (LoggerContext) LogManager.getContext(false);
            final org.apache.logging.log4j.core.config.Configuration config = context.getConfiguration();

            // Console appender
            ConsoleAppender consoleAppender = ConsoleAppender.newBuilder()
                    .setName("Console")
                    .setTarget(ConsoleAppender.Target.SYSTEM_OUT)
                    .setLayout(PatternLayout.newBuilder()
                            .withPattern("[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%-5level] [%c] - %msg%n")
                            .build())
                    .build();
            consoleAppender.start();

            // File appender
            String logFile = new File("logs/app.log").getAbsolutePath();

            // Create triggering policy
            SizeBasedTriggeringPolicy triggeringPolicy = SizeBasedTriggeringPolicy.createPolicy("10 MB");
            triggeringPolicy.start();

            // Create rollover strategy - fixing the parameter count
            DefaultRolloverStrategy rolloverStrategy = DefaultRolloverStrategy.newBuilder()
                    .withMax("7")
                    .withMin("1")
                    .withConfig(config)
                    .build();

            // Create file appender
            RollingFileAppender fileAppender = RollingFileAppender.newBuilder()
                    .setName("File")
                    .withFileName(logFile)
                    .withFilePattern(logFile + ".%d{yyyy-MM-dd}-%i")
                    .setLayout(PatternLayout.newBuilder()
                            .withPattern("[%d{yyyy-MM-dd HH:mm:ss.SSS}] [%-5level] [%c] - %msg%n")
                            .build())
                    .withPolicy(triggeringPolicy)
                    .withStrategy(rolloverStrategy)
                    .build();
            fileAppender.start();

            // Add appenders to configuration
            config.addAppender(consoleAppender);
            config.addAppender(fileAppender);

            // Root logger
            LoggerConfig rootLogger = config.getRootLogger();
            rootLogger.setLevel(Level.INFO);
            rootLogger.addAppender(consoleAppender, Level.INFO, null);
            rootLogger.addAppender(fileAppender, Level.INFO, null);

            // Custom logger for your application
            LoggerConfig appLogger = new LoggerConfig("com.alen", Level.DEBUG, false);
            appLogger.addAppender(consoleAppender, Level.DEBUG, null);
            appLogger.addAppender(fileAppender, Level.DEBUG, null);
            config.addLogger("com.alen", appLogger);

            // Apply changes
            context.updateLoggers();

            return context;
        } catch (Exception e) {
            e.printStackTrace();
            return (LoggerContext) LogManager.getContext(false);
        }
    }
}
