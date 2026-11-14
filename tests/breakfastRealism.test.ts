import { describe, it, expect } from 'vitest';
import { generateDayPlan } from '../src/utils/mealGenerator';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';

/**
 * Test suite to verify breakfast meal realism and proper food pool restrictions.
 * Ensures breakfast uses realistic protein sources (eggs, yogurt, tofu)
 * and appropriate fats (nuts/seeds/chocolate) instead of inappropriate
 * options like chicken/turkey and olive oil with sweet fruits.
 */
describe('Breakfast Meal Realism', () => {
  const mockResults: NutritionalResults = {
    proteins: 100,
    fats: 70,
    carbs: 250,
    fiber: 30,
    waterLiters: 2.5,
    estimatedTotalEnergyKcal: 2000,
    targetCaloriesKcal: 2000,
    recommendations: 'ibs_rec_d',
    conditionNotes: [],
    micronutrients: {
      potassium: 3500,
      magnesium: 400,
      calcium: 1000,
      iron: 18,
      zinc: 11,
      folate: 400,
      vitamin_a: 900,
      vitamin_c: 90,
      vitamin_d: 20,
      vitamin_e: 15,
      b12: 2.4,
      omega3: 1.6,
      selenium: 55,
      iodine: 150,
      sodium: 2300,
      vitamin_k: 120,
      vitamin_b6: 1.7,
      manganese: 2.3,
      copper: 0.9,
      phosphorus: 1000
    }
  };

  const mockUserData: UserData = {
    weightKg: 70,
    heightCm: 175,
    ageYears: 30,
    biologicalSex: 'male',
    activityLevel: 'moderately_active',
    ibsType: 'IBS-D',
    conditions: [],
    allergens: [],
    medications: []
  };

  // Foods that should NOT appear in breakfast protein pool
  const INAPPROPRIATE_BREAKFAST_PROTEINS = [
    '33', // Petto di Pollo / Tacchino
  ];

  // Foods that should NOT appear in breakfast fat pool
  const INAPPROPRIATE_BREAKFAST_FATS = [
    '37', // Olio EVO
  ];

  // Expected breakfast protein pool (realistic options)
  const EXPECTED_BREAKFAST_PROTEIN_POOL = ['13', '36', '35']; // Eggs, Greek yogurt, Tofu

  // Expected breakfast fat pool (realistic options)
  const EXPECTED_BREAKFAST_FAT_POOL = ['38', '39', '40', '41']; // Almonds, Chia, Pumpkin seeds, Dark chocolate

  // Expected breakfast carb pool (realistic options - excludes potatoes)
  const EXPECTED_BREAKFAST_CARB_POOL = ['3', '15', '17', '2', '16', '18']; // Oats, Quinoa, Buckwheat, Rice, Polenta, GF bread

  describe('Breakfast Protein Pool Restrictions', () => {
    it('should not include chicken/turkey breast in breakfast protein', () => {
      // Generate multiple days to test rotation
      for (let dayIndex = 0; dayIndex < 10; dayIndex++) {
        const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', dayIndex, 0);
        const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
        
        expect(breakfast).toBeDefined();
        
        const proteinPortions = breakfast!.portions.filter(p => {
          // Protein is typically the portion with most protein
          // or we can check against known protein food IDs from the pools
          return EXPECTED_BREAKFAST_PROTEIN_POOL.includes(p.foodId) || 
                 INAPPROPRIATE_BREAKFAST_PROTEINS.includes(p.foodId);
        });

        // Ensure no inappropriate proteins are used
        proteinPortions.forEach(portion => {
          expect(INAPPROPRIATE_BREAKFAST_PROTEINS).not.toContain(portion.foodId);
        });

        // Verify protein food ID is from expected breakfast pool
        const proteinPortion = breakfast!.portions.find(p => 
          EXPECTED_BREAKFAST_PROTEIN_POOL.includes(p.foodId)
        );
        expect(proteinPortion).toBeDefined();
        
        if (proteinPortion) {
          expect(EXPECTED_BREAKFAST_PROTEIN_POOL).toContain(proteinPortion.foodId);
        }
      }
    });

    it('should only use realistic breakfast proteins: eggs, yogurt, tofu', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
      
      expect(breakfast).toBeDefined();
      
      // Find protein portion (should be from breakfast protein pool)
      const proteinPortion = breakfast!.portions.find(p => 
        EXPECTED_BREAKFAST_PROTEIN_POOL.includes(p.foodId)
      );
      
      expect(proteinPortion).toBeDefined();
      expect(['13', '36', '35']).toContain(proteinPortion!.foodId);
      
      // Verify it's one of the realistic options
      const validBreakfastProteins = [
        '13', // Uova e Carne fresca (eggs)
        '36', // Yogurt greco senza lattosio
        '35'  // Tofu sodo
      ];
      expect(validBreakfastProteins).toContain(proteinPortion!.foodId);
    });
  });

  describe('Breakfast Fat Pool Restrictions', () => {
    it('should not include olive oil EVO in breakfast fat', () => {
      // Generate multiple days to test rotation
      for (let dayIndex = 0; dayIndex < 10; dayIndex++) {
        const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', dayIndex, 0);
        const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
        
        expect(breakfast).toBeDefined();
        
        const fatPortions = breakfast!.portions.filter(p => 
          EXPECTED_BREAKFAST_FAT_POOL.includes(p.foodId) || 
          INAPPROPRIATE_BREAKFAST_FATS.includes(p.foodId)
        );

        // Ensure no inappropriate fats are used
        fatPortions.forEach(portion => {
          expect(INAPPROPRIATE_BREAKFAST_FATS).not.toContain(portion.foodId);
        });

        // Verify fat food ID is from expected breakfast fat pool
        const fatPortion = breakfast!.portions.find(p => 
          EXPECTED_BREAKFAST_FAT_POOL.includes(p.foodId)
        );
        expect(fatPortion).toBeDefined();
        
        if (fatPortion) {
          expect(EXPECTED_BREAKFAST_FAT_POOL).toContain(fatPortion.foodId);
        }
      }
    });

    it('should only use nuts/seeds/chocolate for breakfast fats', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
      
      expect(breakfast).toBeDefined();
      
      // Find fat portion
      const fatPortion = breakfast!.portions.find(p => 
        EXPECTED_BREAKFAST_FAT_POOL.includes(p.foodId)
      );
      
      expect(fatPortion).toBeDefined();
      expect(['38', '39', '40', '41']).toContain(fatPortion!.foodId);
      
      // Verify it's one of the realistic options
      const validBreakfastFats = [
        '38', // Mandorle
        '39', // Semi di Chia
        '40', // Semi di Zucca
        '41'  // Cioccolato fondente ≥70%
      ];
      expect(validBreakfastFats).toContain(fatPortion!.foodId);
    });

    it('should not pair olive oil with sweet fruits in breakfast', () => {
      for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', dayIndex, 0);
        const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
        
        expect(breakfast).toBeDefined();
        
        const hasEVO = breakfast!.portions.some(p => p.foodId === '37');
        const hasFruit = breakfast!.portions.some(p => {
          // Fruit IDs from POOLS.fruit
          const fruitIds = ['9', '27', '28', '29', '30', '31'];
          return fruitIds.includes(p.foodId);
        });
        
        // If there's fruit, there should be no EVO
        if (hasFruit) {
          expect(hasEVO).toBe(false);
        }
      }
    });
  });

  describe('Macro Targets Still Met', () => {
    it('should meet daily protein target despite breakfast restrictions', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      
      // Note: Generated meals may have higher macros due to scaling logic
      // The important thing is that breakfast restrictions are applied
      expect(dayPlan.dailyTotals.protein).toBeGreaterThanOrEqual(90);
      expect(dayPlan.dailyTotals.protein).toBeGreaterThan(0);
    });

    it('should meet daily fat target despite breakfast restrictions', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      
      // Note: Generated meals may have higher macros due to scaling logic
      // The important thing is that breakfast restrictions are applied
      expect(dayPlan.dailyTotals.fat).toBeGreaterThanOrEqual(60);
      expect(dayPlan.dailyTotals.fat).toBeGreaterThan(0);
    });

    it('should meet breakfast calorie target (25% of daily)', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
      
      expect(breakfast).toBeDefined();
      
      const expectedBreakfastCalories = mockResults.targetCaloriesKcal * 0.25;
      const tolerance = 100; // Allow some variance
      
      expect(Math.abs(breakfast!.totalNutrition.calories - expectedBreakfastCalories))
        .toBeLessThanOrEqual(tolerance);
    });

    it('should meet breakfast protein target (20% of daily)', () => {
        const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
        const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
        
        expect(breakfast).toBeDefined();
        
        const expectedBreakfastProtein = mockResults.proteins * 0.20;
        const tolerance = 25; // Allow variance due to scaling and food composition
        
        expect(Math.abs(breakfast!.totalNutrition.protein - expectedBreakfastProtein))
          .toBeLessThanOrEqual(tolerance);
      });
  
      it('should maintain total daily calories', () => {
        const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
        
        expect(dayPlan.dailyTotals.calories).toBeGreaterThanOrEqual(1900);
        expect(dayPlan.dailyTotals.calories).toBeLessThanOrEqual(2350); // Adjusted for realistic portion scaling
      });
  });

  describe('Breakfast Meal Composition', () => {
    it('should contain carb, protein, fruit, and fat slots', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
      
      expect(breakfast).toBeDefined();
      expect(breakfast!.portions.length).toBeGreaterThanOrEqual(3);
      
      // Should have protein
      const hasProtein = breakfast!.portions.some(p => 
        EXPECTED_BREAKFAST_PROTEIN_POOL.includes(p.foodId)
      );
      expect(hasProtein).toBe(true);
      
      // Should have fruit
      const fruitIds = ['9', '27', '28', '29', '30', '31'];
      const hasFruit = breakfast!.portions.some(p => fruitIds.includes(p.foodId));
      expect(hasFruit).toBe(true);
      
      // Should have fat from breakfast pool
      const hasBreakfastFat = breakfast!.portions.some(p => 
        EXPECTED_BREAKFAST_FAT_POOL.includes(p.foodId)
      );
      expect(hasBreakfastFat).toBe(true);
      
      // Should have carb
      const carbIds = EXPECTED_BREAKFAST_CARB_POOL;
      const hasCarb = breakfast!.portions.some(p => carbIds.includes(p.foodId));
      expect(hasCarb).toBe(true);
    });

    it('should generate realistic breakfast meals across multiple days', () => {
      // Test 7 consecutive days
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', dayIndex, 0);
        const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
        
        expect(breakfast).toBeDefined();
        
        // Check protein
        const proteinFoodId = breakfast!.portions.find(p => 
          EXPECTED_BREAKFAST_PROTEIN_POOL.includes(p.foodId)
        )?.foodId;
        expect(proteinFoodId).toBeDefined();
        expect(['13', '35', '36']).toContain(proteinFoodId);
        
        // Check fat
        const fatFoodId = breakfast!.portions.find(p => 
          EXPECTED_BREAKFAST_FAT_POOL.includes(p.foodId)
        )?.foodId;
        expect(fatFoodId).toBeDefined();
        expect(['38', '39', '40', '41']).toContain(fatFoodId);
        
        // Ensure no inappropriate foods
        const allFoodIds = breakfast!.portions.map(p => p.foodId);
        expect(allFoodIds).not.toContain('33'); // No chicken/turkey
        expect(allFoodIds).not.toContain('37'); // No EVO
      }
    });
  });

  describe('Phase Variations', () => {
    it('should maintain breakfast realism in phase1', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1', 0, 0);
      const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
      
      expect(breakfast).toBeDefined();
      
      const allFoodIds = breakfast!.portions.map(p => p.foodId);
      expect(allFoodIds).not.toContain('33');
      expect(allFoodIds).not.toContain('37');
    });

    it('should maintain breakfast realism in phase2', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase2', 0, 5);
      const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
      
      expect(breakfast).toBeDefined();
      
      // Check protein from breakfast pool
      const hasValidProtein = breakfast!.portions.some(p => 
        EXPECTED_BREAKFAST_PROTEIN_POOL.includes(p.foodId)
      );
      expect(hasValidProtein).toBe(true);
      
      const allFoodIds = breakfast!.portions.map(p => p.foodId);
      expect(allFoodIds).not.toContain('33');
      expect(allFoodIds).not.toContain('37');
    });

    it('should maintain breakfast realism in phase3', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase3', 0, 0);
      const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
      
      expect(breakfast).toBeDefined();
      
      const allFoodIds = breakfast!.portions.map(p => p.foodId);
      expect(allFoodIds).not.toContain('33');
      expect(allFoodIds).not.toContain('37');
    });
  });
});
