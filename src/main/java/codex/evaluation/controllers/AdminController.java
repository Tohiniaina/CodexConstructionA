package codex.evaluation.controllers;

import codex.evaluation.model.DetailDevis;
import codex.evaluation.model.Finition;
import codex.evaluation.model.Travaux;
import codex.evaluation.model.V_ClientDevis;
import codex.evaluation.repository.*;
import codex.evaluation.service.UtilService;
import codex.evaluation.service.V_ClientDevisService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/codexconstruction/admin")
@PreAuthorize("hasRole('ROLE_USERADMIN')")
public class AdminController {

    @Autowired
    V_ClientDevisRepository v_clientDevisRepository;

    @Autowired
    ClientDevisRepository clientDevisRepository;

    @Autowired
    DetailDevisRepository detailDevisRepository;

    @Autowired
    TravauxRepository travauxRepository;

    @Autowired
    FinitionRepository finitionRepository;
    @Autowired
    private V_ClientDevisService v_clientDevisService;
    @Autowired
    private UtilService utilService;

    @GetMapping("/devis")
    public Map<String, Object> index(@RequestParam(name = "page", defaultValue = "1") int page, @RequestParam(name = "pageSize", defaultValue = "7") int pageSize){
        List<V_ClientDevis> listDevis = v_clientDevisService.findPaginate(page-1, pageSize);
        int totalPages = (int)Math.ceil(v_clientDevisRepository.count()/(double)pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("listDevis", listDevis);
        response.put("totalPages", totalPages);
        response.put("page", page);

        return response;
    }


    @GetMapping("/detailsdevis")
    public List<DetailDevis> detailsdevis(@RequestParam("devis") String devis){
        List<DetailDevis> listDetails = detailDevisRepository.findByClientDevis_Id(Integer.parseInt(devis));
        return listDetails;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@RequestParam(name = "year", defaultValue = "2024") int year) {
        double sommeDevis = v_clientDevisRepository.getSommeDevis();
        double sommePaimentDevis = v_clientDevisRepository.getSommePaiementDevis();

        String[] data = clientDevisRepository.dataChart(year);

        for (int i = 0; i < data.length; i++) {
            BigDecimal number = new BigDecimal(data[i]);
            data[i] = number.toPlainString();
        }

        String result = "[" + String.join(", ", data) + "]";

        Map<String, Object> response = new HashMap<>();
        response.put("sommeDevis", sommeDevis);
        response.put("sommePaimentDevis", sommePaimentDevis);
        response.put("year", year);
        response.put("dataChart", result);

        return response;
    }

    @GetMapping("/csvmaisontravaildevis")
    public String csvmaisontravaildevis(HttpServletRequest request, Model model){
        boolean author = utilService.checkAdmin(request);
        if (author == false) {
            model.addAttribute("exception", "Access denied");
            return "exception";
        }

        return "Admin/ImportCsvMaisonTravaux&Devis";
    }

    @GetMapping("/csvpaiement")
    public String csvpaiement(HttpServletRequest request, Model model){
        boolean author = utilService.checkAdmin(request);
        if (author == false) {
            model.addAttribute("exception", "Access denied");
            return "exception";
        }

        double sommeDevis = v_clientDevisRepository.getSommeDevis();
        double sommePaimentDevis = v_clientDevisRepository.getSommePaiementDevis();
        model.addAttribute("sommeDevis", sommeDevis);
        model.addAttribute("sommePaimentDevis", sommePaimentDevis);
        return "Admin/ImportCsvPaiement";
    }

    @GetMapping("/typetravaux")
    public List<Travaux> typetravaux(){
        List<Travaux> listTravaux = travauxRepository.findAll();
        return listTravaux;
    }

    @PostMapping("/savetravaux")
    public ResponseEntity<Map<String, String>> savetravaux(@RequestParam("idTravaux") String idTravaux, @RequestParam("pu") String pu){
        Map<String, String> response = new HashMap<>();
        try {
            Optional<Travaux> findTravaux = travauxRepository.findById(Integer.parseInt(idTravaux));
            if(findTravaux.isEmpty()) {
                throw new Exception("id Travaux introuvable");
            }
            Travaux travaux = findTravaux.get();
            travaux.setPu( Double.parseDouble(pu));
            travaux = travauxRepository.save(travaux);

            response.put("message", "Modification Travaux " + travaux.getNom() + " reussi.");
            response.put("status", "OK");
        } catch (Exception e) {
            response.put("Message", "Une erreur s'est produit");
            response.put("error", e.getMessage());
            response.put("status", "NOT OK");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/typefinition")
    public List<Finition> typefinition(){
        List<Finition> listFinition = finitionRepository.findAll();
        return listFinition;
    }

    @PostMapping("/savefinition")
    public ResponseEntity<Map<String, String>> savefinition(@RequestParam("idFinition") String idFinition, @RequestParam("nomFinition") String nomFinition, @RequestParam("pourcentage") String pourcentage){
        System.out.println("idFinition"+idFinition);
        Finition finition = new Finition(Integer.parseInt(idFinition), nomFinition, Double.parseDouble(pourcentage));
        finitionRepository.save(finition);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Modification Fintition " + nomFinition + " reussi.");
        response.put("status", "OK");
        return ResponseEntity.ok(response);
    }
}
