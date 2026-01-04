requireAuth();

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
});

async function loadPlants() {
  try {
    const data = await apiFetch("/api/plants", {
      method: "GET",
    });

    const plantList = document.getElementById("plantList");
    if (data && data.length > 0) {
      plantList.innerHTML = data
        .map(
          (plant) => {
            const moisture = plant.sensorData?.soilMoisture !== null && plant.sensorData?.soilMoisture !== undefined 
              ? `${plant.sensorData.soilMoisture}%` 
              : 'N/A';
            const tank = plant.sensorData?.tankLevel !== null && plant.sensorData?.tankLevel !== undefined 
              ? `${plant.sensorData.tankLevel}%` 
              : 'N/A';
            const moistureColor = plant.sensorData?.soilMoisture !== null ? 'var(--primary)' : 'var(--text-secondary)';
            const tankColor = plant.sensorData?.tankLevel !== null ? 'var(--secondary)' : 'var(--text-secondary)';
            
            return `
        <div class="plant-item" data-plant-id="${plant.id}" style="padding: 16px; margin-bottom: 16px; background: rgba(16, 185, 129, 0.05); border-radius: 12px; border-left: 4px solid var(--primary);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div style="flex: 1;">
              <span class="plant-name" style="font-weight: 600; color: var(--text-primary); font-size: 18px;">${plant.name}</span>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="edit-plant-btn" data-plant-id="${plant.id}" data-plant-name="${plant.name}" style="padding: 6px 12px; background: var(--secondary); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                ✏️ Edit
              </button>
              <button class="delete-plant-btn" data-plant-id="${plant.id}" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                🗑️ Delete
              </button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
            <div style="padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Soil Moisture</div>
              <div style="font-size: 20px; font-weight: 700; color: ${moistureColor};">${moisture}</div>
            </div>
            <div style="padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px;">
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Tank Level</div>
              <div style="font-size: 20px; font-weight: 700; color: ${tankColor};">${tank}</div>
            </div>
          </div>
        </div>
      `;
          }
        )
        .join("");
      
      attachPlantEventListeners();
    } else {
      plantList.innerHTML =
        '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">No plants yet. Add your first plant!</p>';
    }
  } catch (err) {
    console.error("Failed to load plants:", err);
    document.getElementById("plantList").innerHTML =
      '<p style="text-align: center; padding: 20px; color: #ef4444;">Failed to load plants</p>';
  }
}

async function loadSensorData() {
}

const addPlantBtn = document.getElementById("addPlantBtn");
const addPlantForm = document.getElementById("addPlantForm");
const plantForm = document.getElementById("plantForm");
const cancelAddBtn = document.getElementById("cancelAddBtn");

addPlantBtn.addEventListener("click", () => {
  plantForm.reset();
  const submitBtn = plantForm.querySelector('button[type="submit"]');
  const cancelBtn = plantForm.querySelector('#cancelAddBtn');
  const nameInput = document.getElementById("plantName");
  
  submitBtn.disabled = false;
  cancelBtn.disabled = false;
  nameInput.disabled = false;
  submitBtn.textContent = "Add";
  
  addPlantForm.style.display = "block";
  addPlantBtn.style.display = "none";
  nameInput.focus();
});

cancelAddBtn.addEventListener("click", () => {
  addPlantForm.style.display = "none";
  addPlantBtn.style.display = "block";
  plantForm.reset();
});

plantForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const plantName = document.getElementById("plantName").value.trim();
  if (!plantName) {
    alert("Please enter a plant name");
    return;
  }

  const submitBtn = plantForm.querySelector('button[type="submit"]');
  const cancelBtn = plantForm.querySelector('#cancelAddBtn');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  cancelBtn.disabled = true;
  document.getElementById("plantName").disabled = true;
  submitBtn.textContent = "Adding...";

  try {
    await apiFetch("/api/plants", {
      method: "POST",
      body: { name: plantName },
    });

    plantForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    cancelBtn.disabled = false;
    document.getElementById("plantName").disabled = false;

    addPlantForm.style.display = "none";
    addPlantBtn.style.display = "block";

    await loadPlants();
    
    showMessage("Plant added successfully!", "success");
  } catch (err) {
    console.error("Failed to add plant:", err);
    showMessage(err.message || "Failed to add plant. Please try again.", "error");
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    cancelBtn.disabled = false;
    document.getElementById("plantName").disabled = false;
  }
});

function showMessage(message, type) {
  const messageEl = document.createElement("div");
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    background: ${type === "success" ? "var(--primary)" : "#ef4444"};
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  messageEl.textContent = message;
  document.body.appendChild(messageEl);

  setTimeout(() => {
    messageEl.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => messageEl.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  .btn-add-plant:hover {
    background: var(--primary-dark) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  .btn-add-plant:active {
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

function attachPlantEventListeners() {
  document.querySelectorAll(".delete-plant-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const plantId = e.target.dataset.plantId;
      const plantName = e.target.closest(".plant-item").querySelector(".plant-name").textContent;
      
      if (!confirm(`Are you sure you want to delete "${plantName}"?`)) {
        return;
      }

      try {
        await apiFetch(`/api/plants/${plantId}`, {
          method: "DELETE",
        });
        
        showMessage("Plant deleted successfully!", "success");
        await loadPlants();
      } catch (err) {
        console.error("Failed to delete plant:", err);
        showMessage(err.message || "Failed to delete plant", "error");
      }
    });
  });

  document.querySelectorAll(".edit-plant-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const plantId = e.target.dataset.plantId;
      const plantName = e.target.dataset.plantName;
      const plantItem = e.target.closest(".plant-item");
      
      const editForm = `
        <div style="margin-top: 12px; padding: 12px; background: var(--card-bg); border-radius: 8px; border: 1px solid var(--border);">
          <form class="edit-plant-form" data-plant-id="${plantId}" style="display: flex; gap: 8px; align-items: flex-end;">
            <input type="text" class="edit-plant-name" value="${plantName}" required
                   style="flex: 1; padding: 8px 12px; border: 2px solid var(--input-border); border-radius: 8px; font-size: 14px; background: var(--input-bg); color: var(--text-primary);">
            <button type="submit" style="padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
              Save
            </button>
            <button type="button" class="cancel-edit-btn" style="padding: 8px 16px; background: var(--muted); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
              Cancel
            </button>
          </form>
        </div>
      `;
      
      plantItem.insertAdjacentHTML("beforeend", editForm);
      plantItem.querySelector(".edit-plant-name").focus();
      
      plantItem.querySelector(".edit-plant-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = plantItem.querySelector(".edit-plant-name").value.trim();
        
        if (!newName) {
          alert("Plant name cannot be empty");
          return;
        }

        try {
          await apiFetch(`/api/plants/${plantId}`, {
            method: "PUT",
            body: { name: newName },
          });
          
          showMessage("Plant renamed successfully!", "success");
          await loadPlants();
        } catch (err) {
          console.error("Failed to update plant:", err);
          showMessage(err.message || "Failed to update plant", "error");
        }
      });

      plantItem.querySelector(".cancel-edit-btn").addEventListener("click", () => {
        plantItem.querySelector(".edit-plant-form").closest("div").remove();
      });
    });
  });
}

loadPlants();
