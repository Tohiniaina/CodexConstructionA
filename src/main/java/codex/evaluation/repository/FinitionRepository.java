package codex.evaluation.repository;

import codex.evaluation.model.Finition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FinitionRepository extends JpaRepository<Finition,Integer> {
    Finition findByNom(String nom);

    @Override
    @Query("SELECT f FROM Finition f ORDER BY f.id")
    List<Finition> findAll();
}
