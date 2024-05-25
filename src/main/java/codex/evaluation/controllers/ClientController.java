package codex.evaluation.controllers;

import codex.evaluation.model.*;
import codex.evaluation.repository.*;
import codex.evaluation.service.PaiementService;
import codex.evaluation.service.UserAdminService;
import codex.evaluation.service.V_ClientDevisService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/codexconstruction/client")
public class ClientController {
    @Autowired
    TypeMaisonRepository typeMaisonRepository;
    @Autowired
    FinitionRepository finitionRepository;
    @Autowired
    ClientDevisRepository clientDevisRepository;
    @Autowired
    V_ClientDevisRepository v_clientDevisRepository;
    @Autowired
    TravauxMaisonRepository travauxMaisonRepository;
    @Autowired
    DetailDevisRepository detailDevisRepository;
    @Autowired
    PaiementRepository paiementRepository;
    @Autowired
    UserClientRepository userClientRepository;

    @Autowired
    private PaiementService paiementService;
    @Autowired
    private V_ClientDevisService v_clientDevisService;
    @Autowired
    PdfModel pdfModel;

    @GetMapping("/devis")
    public Map<String, Object> devis(@RequestParam(name = "page", defaultValue = "1") int page, @RequestParam(name = "pageSize", defaultValue = "5") int pageSize){
        UserClient user = new UserClient();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            user = userClientRepository.findByNumero(username).get();
        }

        int taille = v_clientDevisRepository.countByUserClient_Id(user.getId());
        List<V_ClientDevis> listDevis = v_clientDevisService.findPaginateByIdUser(user.getId(), page-1, pageSize);
        int totalPages = (int)Math.ceil(taille/(double)pageSize);
        Map<String, Object> response = new HashMap<>();
        response.put("Taille", taille);
        response.put("listDevis", listDevis);
        response.put("totalPages", totalPages);
        response.put("page", page);

        return response;
    }

    @GetMapping("/newdevis")
    public Map<String, Object> newdevis(){
        List<TypeMaison> typeMaisons = typeMaisonRepository.findAll();
        List<Finition> finitionList = finitionRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("typeMaisons", typeMaisons);
        response.put("finitionList", finitionList);

        return response;
    }

    @PostMapping("/payer")
    public ResponseEntity<HashMap<String, String>> payer(
                                                         @RequestParam("devis") Integer devis,
                                                         @RequestParam("date") String date,
                                                         @RequestParam("montant") Double montant){
        System.out.println("Paiement devis "+devis);
        System.out.println("Date "+date);
        System.out.println("Montant "+montant);
        HashMap<String, String> result = new HashMap<>();
        try {
            paiementService.payer(new ClientDevis(devis), Date.valueOf(date), montant);
            result.put("etat", "succes");
        }catch (Exception e) {
            result.put("etat", "error");
            result.put("message", e.getMessage());
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/insertdevis")
    @Transactional
    public ResponseEntity<?> insertdevis(@RequestParam("lieu") String lieu, @RequestParam("typeMaison") String typeMaison, @RequestParam("typeFinition") String typeFinition, @RequestParam("datedebut") String datedebut){
        UserClient user = new UserClient();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            user = userClientRepository.findByNumero(username).get();
        }

        Date dateDevis = new Date(new java.util.Date().getTime());
        Date dateDebutTravaux = Date.valueOf(datedebut);

        TypeMaison typeMaisonModel = typeMaisonRepository.findById(Integer.parseInt(typeMaison)).get();
        Date dateFinTravaux = Date.valueOf((LocalDate.parse(datedebut).plusDays(typeMaisonModel.getDuree()).toString()));

        Finition finition = finitionRepository.findById(Integer.parseInt(typeFinition)).get();

        List<TravauxMaison> travauxMaison = travauxMaisonRepository.findByTypeMaison_Id(typeMaisonModel.getId());

        ClientDevis clientDevis = new ClientDevis(lieu, user, typeMaisonModel, dateDevis, dateDebutTravaux, dateFinTravaux, finition.getNom(), finition.getPourcentage());

        ClientDevis newClientDevis = clientDevisRepository.save(clientDevis);
        newClientDevis.generateRef();

        HashMap<String, String> result = new HashMap<>();

        try {
            newClientDevis = clientDevisRepository.save(newClientDevis);

            for (TravauxMaison tm: travauxMaison) {
                DetailDevis dtv = new DetailDevis(tm.getTravaux().getCode(), newClientDevis, tm.getTravaux().getNom(), tm.getTravaux().getUnite(), tm.getQte(), tm.getTravaux().getPu());
                detailDevisRepository.save(dtv);
            }
            result.put("etat", "succes");
        }catch (Exception e) {
            result.put("etat", "error");
            result.put("message", e.getMessage());
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

        @GetMapping("/detailsdevis")
    public ResponseEntity<byte[]> detailsdevis(HttpServletResponse response, @RequestParam("devis") String devis) {
        List<DetailDevis> listDetails = detailDevisRepository.findByClientDevis_Id(Integer.parseInt(devis));
        List<Paiement> paiementList = paiementRepository.findByClientDevis_IdOrderByDate(Integer.parseInt(devis));

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            pdfModel.export(baos, listDetails, paiementList);
            byte[] pdfBytes = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "detailsdevis.pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
