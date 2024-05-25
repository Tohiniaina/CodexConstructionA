package codex.evaluation.controllers;

import codex.evaluation.model.*;
import codex.evaluation.model.Error;
import codex.evaluation.repository.ImportDevisRepository;
import codex.evaluation.repository.ImportMaisonTravauxRepository;
import codex.evaluation.repository.ImportPaiementRepository;
import codex.evaluation.service.DatabaseResetService;
import codex.evaluation.service.ErreurService;
import codex.evaluation.service.UtilService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping("/codexconstruction/util")
public class UtilController {
    @Autowired
    ImportMaisonTravauxRepository importMaisonTravauxRepository;
    @Autowired
    ImportDevisRepository importDevisRepository;
    @Autowired
    ImportPaiementRepository importPaiementRepository;
    private final UtilService utilService;
    private final ErreurService erreurService;
    private final DatabaseResetService databaseResetService;
    @Autowired
    private PdfModel pdfModel;

    @Autowired
    public UtilController(UtilService utilService, ErreurService erreurService, DatabaseResetService databaseResetService) {
        this.utilService = utilService;
        this.erreurService = erreurService;
        this.databaseResetService = databaseResetService;
    }

    @GetMapping("/importcsv")
    public String importcsv() {
        return "Admin/ImportCsv";
    }

    @GetMapping("/databaseconfirm")
    public String databaseconfirm() {
        return "Admin/authDatabase-confirm";
    }

    @PostMapping("/importercsvmaisontravauxetdevis")
    public ResponseEntity<Map<String, String>> importercsvmaisontravaux(
            @RequestParam("csvmaisontravaux") MultipartFile csvmaisontravaux,
            @RequestParam("csvdevis") MultipartFile csvdevis) {
        System.out.println("Import en cours ...");
        try {
            utilService.insert_importMaisonTravaux(csvmaisontravaux);
            utilService.insert_importDevis(csvdevis);

            List<ImportmaisontravauxEntity> importmaisontravauxEntities = importMaisonTravauxRepository.findAll();
            utilService.insertCsvImportMaisonTravaux(importmaisontravauxEntities);

            List<ImportdevisEntity> importdevisEntities = importDevisRepository.findAll();
            utilService.insertCsvImportDevis(importdevisEntities);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Importation réussie");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("error : " + e.getMessage());
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur lors de l'importation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/importercsvpaiement")
    public ResponseEntity<Map<String, String>> importercsvpaiement(@RequestParam("csvpaiement") MultipartFile csvpaiement) {
        System.out.println("Import en cours ...");
        try {
            utilService.insert_importPaiement(csvpaiement);

            List<ImportpaiementEntity> importpaiementEntities = importPaiementRepository.findAll();
            for (ImportpaiementEntity importpaiementEntity: importpaiementEntities) {
                System.out.println("Paiement : "+importpaiementEntity.getRefPaiement());
            }
            utilService.insertCsvImportPaiement(importpaiementEntities);

            // Créer un objet Map pour la réponse JSON
            Map<String, String> response = new HashMap<>();
            response.put("message", "Importation réussie");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("error : "+e.getMessage());;
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur lors de l'importation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/readcsv")
    public String importData(Model model, @RequestParam("filecsv") MultipartFile file) {
        try {
            List<String[]> data = utilService.readData(file);
            model.addAttribute("data", data);
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            e.printStackTrace();
        }
        return "admin/ResultDataCsv";
    }

    @GetMapping("/exportCSV")
    public void exportData(HttpServletResponse response) throws IOException {
        // Créer des données de test (remplacez cela par vos propres données)
        /*List<Person> people = new ArrayList<>();
        people.add(new Person("John Doe", 30));
        people.add(new Person("Jane Doe", 25));
        people.add(new Person("Bob Smith", 40));

        // Appeler la méthode de la classe de service pour effectuer l'exportation
        utilService.exportToCSV(people, Person.class, response);*/
    }

    @PostMapping("/exportPDF")
    public void exportDataPDF(HttpServletResponse response) throws IOException {
        //List<Modele> modeles = modeleService.findAll();
        response.setContentType("application/pdf");

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=modeles_" + currentDateTime + ".pdf";
        response.setHeader(headerKey, headerValue);

        //pdfModel.export(response, modeles);
    }

    @GetMapping("/resetDatabase")
    public ResponseEntity<Map<String, String>> resetDatabase() {
        Map<String, String> response = new HashMap<>();
        try {
            databaseResetService.CleanUpDb();

            response.put("message", "Suppression des données reussi.");
            response.put("status", "OK");
        } catch (Exception e) {
            response.put("Message", "Une erreur s'est produit");
            response.put("error", e.getMessage());
            response.put("status", "NOT OK");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.ok(response);
    }
}
