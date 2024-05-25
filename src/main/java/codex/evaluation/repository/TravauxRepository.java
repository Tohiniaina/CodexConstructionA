package codex.evaluation.repository;

import codex.evaluation.model.Travaux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface TravauxRepository extends JpaRepository<Travaux,Integer> {
    Travaux findByCode(String code);

    @Override
    @Query("SELECT t FROM Travaux t ORDER BY t.id")
    List<Travaux> findAll();
}
