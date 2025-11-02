package unsa.ba.etf.learnway.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class BackupController {

    @PostMapping("/api/backup")
    public ResponseEntity<String> createBackup() {
        String user = "root";           // MySQL korisnik
        String password = "root";       // MySQL password
        String originalDb = "learnway";
        String backupDb = "learnwaybackup";

        // Putanja do MySQL alata
        String mysqlPath = "\"C:\\\\Program Files\\\\MySQL\\\\MySQL Server 8.0\\\\bin\\\\mysql.exe\"";
        String mysqldumpPath = "\"C:\\\\Program Files\\\\MySQL\\\\MySQL Server 8.0\\\\bin\\\\mysqldump.exe\"";

        try {
            Process drop = Runtime.getRuntime().exec(
                    mysqlPath + " -u " + user + " -p" + password + " -e \"DROP DATABASE IF EXISTS " + backupDb + ";\""
            );
            drop.waitFor();

            Process create = Runtime.getRuntime().exec(
                    mysqlPath + " -u " + user + " -p" + password + " -e \"CREATE DATABASE " + backupDb + ";\""
            );
            create.waitFor();

            Process dump = Runtime.getRuntime().exec(new String[]{
                    "cmd.exe", "/c",
                    mysqldumpPath + " -u " + user + " -p" + password + " " + originalDb +
                            " | " + mysqlPath + " -u " + user + " -p" + password + " " + backupDb
            });
            dump.waitFor();

            return ResponseEntity.ok("Backup created successfully ✅");

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Backup failed ❌");
        }
    }
}
