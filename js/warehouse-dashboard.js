// Warehouse Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // Translation functions
  function translateEquipmentType(type) {
    const translations = {
      'monitor': 'Монитор',
      'keyboard': 'Клавиатура', 
      'mouse': 'Мышь',
      'processor': 'Процессор',
      'motherboard': 'Материнская плата',
      'ram': 'Оперативная память',
      'gpu': 'Видеокарта',
      'storage': 'Накопитель',
      'power-supply': 'Блок питания',
      'cooling': 'Система охлаждения',
      'case-component': 'Корпус',
      'switch': 'Коммутатор',
      'cables': 'Кабели',
      'cat45-connector': 'Cat45 Connector',
      'usb-connector': 'USB Connector',
      'cat45-ethernet': 'Cat45 Ethernet',
      'vga-cable': 'VGA кабель',
      'hdmi-cable': 'HDMI кабель',
      'hdmi-to-dp': 'HDMI to DP',
      'vga-to-hdmi': 'VGA to HDMI',
      'vga-to-dp': 'VGA to DP',
      'power-cable': 'Блок питания кабель',
      'headphone-adapter': 'Адаптер наушника',
      'printer-cable': 'Принтер кабель',
      'headphone-cable': 'Наушник кабель',
      'ups': 'ИБП',
      'ip-telephony': 'IP-телефония',
      'projector': 'Проектор',
      'notebook': 'Ноутбук',
      'printer': 'Принтер',
      'tv': 'Телевизор',
      'extension-cord': 'Удлинитель',
      'pc-case': 'PC Case',
      'other': 'Медиа',
      'additional': 'Другое',
      'earphones': 'Наушники',
      'switch-media': 'Switch Kommutator'
    };
    return translations[type] || type;
  }
  
  function translateCondition(condition) {
    const translations = {
      'new': 'Новое',
      'used': 'Б/у',
      'refurbished': 'Восстановленное'
    };
    return translations[condition] || condition;
  }
  
  function translateQuality(quality) {
    const translations = {
      'High': 'Высокое',
      'Standard': 'Стандартное'
    };
    return translations[quality] || quality;
  }
  
  function translateConnectivity(connectivity) {
    const translations = {
      'wired': 'Проводное',
      'wireless': 'Беспроводное',
      'both': 'Проводное/Беспроводное',
      'integrated': 'Встроенное',
      'not-applicable': 'Не применимо'
    };
    return translations[connectivity] || connectivity;
  }
  
  // Initialize dashboard when "Технический сбой" is clicked
  function initWarehouseDashboard() {
    const techIssueItem = document.getElementById('sidebar-tech-issue'); // Технический сбой
    const warehouseDashboard = document.getElementById('warehouse-dashboard');
    const defaultPlaceholder = document.getElementById('default-placeholder');
    const sidebarItems = document.querySelectorAll('nav.sidebar-menu-figma a');
    
    console.log('Tech issue item:', techIssueItem);
    console.log('Warehouse dashboard:', warehouseDashboard);
    
    // Add click handler for tech issue menu
    if (techIssueItem) {
      techIssueItem.addEventListener('click', function(e) {
        // Only prevent default for direct clicks on the tech issue item itself
        // Don't interfere with header chat button or other elements
        if (e.target === this || e.target.closest('a') === this) {
          e.preventDefault();
        }
        console.log('Tech issue clicked!');
        console.log('Warehouse dashboard element:', warehouseDashboard);
        console.log('Default placeholder element:', defaultPlaceholder);
        
        // Remove active class from all sidebar items
        sidebarItems.forEach(item => {
          item.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide default placeholder and show warehouse dashboard
        if (defaultPlaceholder) {
          defaultPlaceholder.style.display = 'none';
          console.log('Default placeholder hidden');
        }
        if (warehouseDashboard) {
          warehouseDashboard.style.display = 'block';
          console.log('Warehouse dashboard shown');
        }
        
        // Initialize warehouse functionality
        initializeWarehouseFeatures();
        console.log('Warehouse features initialized');
        
        // Update modal positions for the new section
        if (typeof updateModalPositionsOnSectionChange === 'function') {
          updateModalPositionsOnSectionChange();
        }
      });
    } else {
      console.error('Tech issue item not found!');
    }
    
    // Add click handlers for other sidebar items to hide warehouse dashboard
    sidebarItems.forEach(item => {
      if (item.id !== 'sidebar-tech-issue') {
        item.addEventListener('click', function(e) {
          // Hide warehouse dashboard and show default content
          if (warehouseDashboard) warehouseDashboard.style.display = 'none';
          if (defaultPlaceholder) defaultPlaceholder.style.display = 'block';
          
          // Update active states (this is also handled by main-page-custom.js)
          sidebarItems.forEach(sidebarItem => {
            sidebarItem.classList.remove('active');
          });
          this.classList.add('active');
          
          // Update modal positions for the new section
          if (typeof updateModalPositionsOnSectionChange === 'function') {
            updateModalPositionsOnSectionChange();
          }
        });
      }
    });
  }
  
  // Initialize warehouse features
  function initializeWarehouseFeatures() {
    initializeAddEquipmentForm();
    initializeSearch();
    initializeFilter();
    loadEquipmentData();
  }
  
  // Equipment data storage
  let equipmentData = [
    {
      id: 'MON001',
      type: 'monitor',
      name: 'Dell UltraSharp U2723QE',
      size: '27',
      quality: 'High',
      condition: 'new',
      connectivity: 'wired',
      keyboardButtons: null,
      quantity: 3,
      dateAdded: '2024-01-15',
      characteristics: '4K resolution, USB-C hub, height adjustable'
    },
    {
      id: 'KEY001',
      type: 'keyboard',
      name: 'Logitech MX Keys',
      size: 'Full Size',
      quality: 'High',
      condition: 'new',
      connectivity: 'wireless',
      keyboardButtons: '104',
      quantity: 5,
      dateAdded: '2024-01-20',
      characteristics: 'Wireless, backlit, USB-C charging'
    },
    {
      id: 'MOU001',
      type: 'mouse',
      name: 'Logitech MX Master 3',
      size: 'Standard',
      quality: 'High',
      condition: 'new',
      connectivity: 'wireless',
      keyboardButtons: null,
      quantity: 8,
      dateAdded: '2024-01-25',
      characteristics: 'Wireless, precision scroll wheel, multiple device connectivity'
    },
    {
      id: 'PRO001',
      type: 'processor',
      name: 'Intel Core i7-13700K',
      size: 'x64',
      quality: 'High',
      condition: 'new',
      connectivity: 'integrated',
      keyboardButtons: null,
      quantity: 2,
      dateAdded: '2024-02-01',
      characteristics: '16 cores, 24 threads, 3.4GHz base clock'
    }
  ];
  
  // Initialize add equipment form
  function initializeAddEquipmentForm() {
    const form = document.getElementById('add-equipment-form');
    const cancelBtn = document.getElementById('add-equipment-cancel-btn');
    const qualityToggle = document.getElementById('quality-toggle');
    const qualityLabel = document.getElementById('quality-label');
    const equipmentTypeRadios = document.querySelectorAll('input[name="equipment-type"]');
    const sizeInput = document.getElementById('equipment-size');
    
    // Clear form functionality
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        form.reset();
        qualityLabel.textContent = 'Стандартное качество';
        updateSizeSection();
        
        // Clear editing state if any
        form.removeAttribute('data-editing-id');
        document.getElementById('add-equipment-submit-btn').textContent = 'Добавить';
        
        // Reset connectivity field user modification flag
        const connectivitySelect = document.getElementById('equipment-connectivity');
        if (connectivitySelect) {
          connectivitySelect.removeAttribute('data-user-modified');
        }
        
        // Reset keyboard buttons field user modification flag
        const keyboardButtonsSelect = document.getElementById('keyboard-buttons');
        if (keyboardButtonsSelect) {
          keyboardButtonsSelect.removeAttribute('data-user-modified');
        }
      });
    }
    
    // Quality toggle
    if (qualityToggle) {
      qualityToggle.addEventListener('change', function() {
        qualityLabel.textContent = this.checked ? 'Высокое качество' : 'Стандартное качество';
      });
    }
    
    // Equipment type change handler
    equipmentTypeRadios.forEach(radio => {
      radio.addEventListener('change', updateSizeSection);
    });
    
    function updateSizeSection() {
      const selectedType = document.querySelector('input[name="equipment-type"]:checked').value;
      const sizeInput = document.getElementById('equipment-size');
      const sizeColumn = sizeInput.closest('.add-equipment-form-column');
      const sizeLabel = sizeColumn.querySelector('.add-equipment-form-label');
      const sizeHint = sizeColumn.querySelector('.add-equipment-form-hint');
      
      if (selectedType === 'monitor') {
        sizeLabel.textContent = 'Размер (дюймы)';
        sizeInput.placeholder = 'например, 27';
        sizeHint.textContent = 'Введите размер экрана в дюймах.';
      } else if (selectedType === 'keyboard') {
        sizeLabel.textContent = 'Тип размера';
        sizeInput.placeholder = 'например, Полноразмерная, Компактная, 60%';
        sizeHint.textContent = 'Введите тип размера клавиатуры.';
      } else if (selectedType === 'mouse') {
        sizeLabel.textContent = 'Размер';
        sizeInput.placeholder = 'например, Стандартная, Большая, Компактная';
        sizeHint.textContent = 'Введите категорию размера мыши.';
      } else if (selectedType === 'processor') {
        sizeLabel.textContent = 'Архитектура';
        sizeInput.placeholder = 'например, x64, ARM64';
        sizeHint.textContent = 'Введите архитектуру процессора.';
      } else if (selectedType === 'extension-cord') {
        sizeLabel.textContent = 'Длина';
        sizeInput.placeholder = 'например, 5м, 3м';
        sizeHint.textContent = 'Введите длину кабеля.';
      } else if (selectedType === 'additional') {
        sizeLabel.textContent = 'Размер/Тип';
        sizeInput.placeholder = 'например, Большой, Малый, 2м';
        sizeHint.textContent = 'Введите размер или тип дополнительного оборудования.';
      } else if (selectedType === 'switch') {
        sizeLabel.textContent = 'Количество портов';
        sizeInput.placeholder = 'например, 8-портовый, 24-портовый';
        sizeHint.textContent = 'Введите количество портов.';
      } else if (selectedType === 'pc-case') {
        sizeLabel.textContent = 'Форм-фактор';
        sizeInput.placeholder = 'например, Mid Tower, Full Tower, Mini-ITX';
        sizeHint.textContent = 'Введите форм-фактор корпуса.';
      } else if (selectedType === 'earphones') {
        sizeLabel.textContent = 'Тип';
        sizeInput.placeholder = 'например, Накладные, Вкладыши, Беспроводные';
        sizeHint.textContent = 'Введите тип наушников.';
      }
      
      // Update characteristics section based on equipment type
      updateCharacteristicsSection(selectedType);
      
      // Update connectivity section based on equipment type
      updateConnectivitySection(selectedType);
      
      // Update keyboard buttons section based on equipment type
      updateKeyboardButtonsSection(selectedType);
    }
    
    function updateCharacteristicsSection(selectedType) {
      // Hide all equipment-specific sections
      const allSections = [
        'earphones-section',
        'monitor-section', 
        'keyboard-section',
        'mouse-section',
        'pc-case-component-section',
        'cables-component-section',
        'other-component-section'
      ];
      
      // Hide all PC component sections
      const pcComponentSections = [
        'processor-component-section',
        'motherboard-component-section',
        'ram-component-section',
        'gpu-component-section',
        'storage-component-section',
        'power-supply-component-section',
        'cooling-component-section',
        'case-component-section'
      ];
      
      // Hide all other component sections
      const otherComponentSections = [
        'switch-other-section',
        'ups-other-section',
        'ip-telephony-other-section',
        'projector-other-section',
        'notebook-other-section',
        'printer-other-section',
        'tv-other-section'
      ];
      
      // Hide all cable component sections
      const cableComponentSections = [
        'cat45-connector-section',
        'usb-connector-section',
        'cat45-ethernet-section',
        'vga-cable-section',
        'hdmi-cable-section',
        'hdmi-to-dp-section',
        'vga-to-hdmi-section',
        'vga-to-dp-section',
        'power-cable-section',
        'headphone-adapter-section',
        'printer-cable-section',
        'headphone-cable-section'
      ];
      
      [...allSections, ...pcComponentSections, ...otherComponentSections, ...cableComponentSections].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = 'none';
        }
      });
      
      // Handle PC case component selection
      const pcCaseComponentSection = document.getElementById('pc-case-component-section');
      const otherComponentSection = document.getElementById('other-component-section');
      const genericSection = document.getElementById('generic-characteristics');
      
      if (selectedType === 'pc-case') {
        // Show PC component selection grid
        if (pcCaseComponentSection) {
          pcCaseComponentSection.style.display = 'block';
        }
        if (genericSection) {
          genericSection.style.display = 'none';
        }
        
        // Add event listeners for PC component selection
        const pcComponentRadios = document.querySelectorAll('input[name="pc-component-type"]');
        pcComponentRadios.forEach(radio => {
          radio.addEventListener('change', function() {
            if (this.checked) {
              updatePCComponentCharacteristics(this.value);
            }
          });
        });
        
        return; // Exit early for PC case
      }
      
      if (selectedType === 'other') {
        // Show Other component selection grid
        if (otherComponentSection) {
          otherComponentSection.style.display = 'block';
        }
        if (genericSection) {
          genericSection.style.display = 'none';
        }
        
        // Add event listeners for Other component selection
        const otherComponentRadios = document.querySelectorAll('input[name="other-component-type"]');
        otherComponentRadios.forEach(radio => {
          radio.addEventListener('change', function() {
            if (this.checked) {
              updateOtherComponentCharacteristics(this.value);
            }
          });
        });
        
        return; // Exit early for Other
      }
      
      if (selectedType === 'cables') {
        // Show Cables component selection grid
        const cablesComponentSection = document.getElementById('cables-component-section');
        if (cablesComponentSection) {
          cablesComponentSection.style.display = 'block';
        }
        if (genericSection) {
          genericSection.style.display = 'none';
        }
        
        // Add event listeners for Cable component selection
        const cableComponentRadios = document.querySelectorAll('input[name="cable-component-type"]');
        cableComponentRadios.forEach(radio => {
          radio.addEventListener('change', function() {
            if (this.checked) {
              updateCableComponentCharacteristics(this.value);
            }
          });
        });
        
        return; // Exit early for Cables
      }
      
      // Show the appropriate section for other equipment types
      const sectionMap = {
        'earphones': 'earphones-section',
        'monitor': 'monitor-section',
        'keyboard': 'keyboard-section', 
        'mouse': 'mouse-section'
      };
      
      const targetSectionId = sectionMap[selectedType];
      
      if (targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
          targetSection.style.display = 'block';
        }
        // Hide generic characteristics for equipment with specific sections
        if (genericSection) {
          genericSection.style.display = 'none';
        }
      } else {
        // Show generic characteristics for equipment types without specific sections
        if (genericSection) {
          genericSection.style.display = 'block';
        }
        
        // Set placeholder and hint for generic section based on equipment type
        const characteristicsInput = document.getElementById('equipment-characteristics');
        const characteristicsHint = genericSection.querySelector('.add-equipment-form-hint');
        
        const genericTemplates = {
          'processor': {
            placeholder: 'Производитель: Intel\nМодель: Core i7-13700K\nАрхитектура: x64\nКоличество ядер: 16 (8P+8E)\nКоличество потоков: 24\nБазовая частота: 3.4 GHz\nМаксимальная частота: 5.4 GHz\nСокет: LGA1700\nTDP: 125W',
            hint: 'Укажите производителя, модель, архитектуру, количество ядер/потоков, частоты и другие технические характеристики процессора.'
          },
          'extension-cord': {
            placeholder: 'Производитель: APC\nДлина кабеля: 5 метров\nКоличество розеток: 6\nМаксимальная нагрузка: 3500W\nЗащита от перенапряжения: Да\nТип вилки: Schuko (Type F)\nЗаземление: Да\nИндикатор питания: Светодиодный',
            hint: 'Укажите производителя, длину кабеля, количество розеток, максимальную нагрузку и функции защиты удлинителя.'
          },
          'additional': {
            placeholder: 'Производитель: Generic\nМодель: Дополнительное оборудование\nТип: Разное\nРазмер: Стандартный\nМатериал: Пластик/Металл\nВес: 1 кг\nЦвет: Черный\nСовместимость: Универсальная\nГарантия: 1 год',
            hint: 'Укажите производителя, модель, тип, размер и другие характеристики дополнительного оборудования.'
          },
          'cables': {
            placeholder: 'Производитель: Generic\nТип кабеля: HDMI\nВерсия: 2.0\nДлина: 2 метра\nПоддерживаемое разрешение: 4K 60Hz\nМатериал экрана: Алюминиевая фольга\nРазъемы: HDMI Male to HDMI Male',
            hint: 'Выберите тип кабеля из списка ниже, чтобы увидеть специфичные характеристики.'
          }
        };
        
        const template = genericTemplates[selectedType];
        if (template && characteristicsInput && characteristicsHint) {
          characteristicsInput.placeholder = template.placeholder;
          characteristicsHint.textContent = template.hint;
        }
      }
      
      // Handle microphone toggle for earphones
      if (selectedType === 'earphones') {
        const microphoneToggle = document.getElementById('earphones-microphone');
        const microphoneDetails = document.getElementById('microphone-details');
        
        if (microphoneToggle && microphoneDetails) {
          microphoneToggle.addEventListener('change', function() {
            microphoneDetails.style.display = this.checked ? 'flex' : 'none';
          });
        }
      }
    }

    // New function to handle PC component characteristics
    function updatePCComponentCharacteristics(componentType) {
      // Hide all PC component sections first
      const pcComponentSections = [
        'processor-component-section',
        'motherboard-component-section', 
        'ram-component-section',
        'gpu-component-section',
        'storage-component-section',
        'power-supply-component-section',
        'cooling-component-section',
        'case-component-section'
      ];
      
      pcComponentSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = 'none';
        }
      });
      
      // Show the selected component section
      const componentSectionMap = {
        'processor': 'processor-component-section',
        'motherboard': 'motherboard-component-section',
        'ram': 'ram-component-section',
        'gpu': 'gpu-component-section',
        'storage': 'storage-component-section',
        'power-supply': 'power-supply-component-section',
        'cooling': 'cooling-component-section',
        'case-component': 'case-component-section'
      };
      
      const targetSectionId = componentSectionMap[componentType];
      if (targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
          targetSection.style.display = 'block';
        }
      }
    }
    
    function updateOtherComponentCharacteristics(componentType) {
      // Hide all other component sections first
      const otherComponentSections = [
        'switch-other-section',
        'ups-other-section',
        'ip-telephony-other-section',
        'projector-other-section',
        'notebook-other-section',
        'printer-other-section',
        'tv-other-section'
      ];
      
      otherComponentSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = 'none';
        }
      });
      
      // Show the selected component section
      const componentSectionMap = {
        'switch': 'switch-other-section',
        'ups': 'ups-other-section',
        'ip-telephony': 'ip-telephony-other-section',
        'projector': 'projector-other-section',
        'notebook': 'notebook-other-section',
        'printer': 'printer-other-section',
        'tv': 'tv-other-section',
        'switch-media': 'switch-other-section'
      };
      
      const targetSectionId = componentSectionMap[componentType];
      if (targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
          targetSection.style.display = 'block';
        }
      }
    }
    
    function updateCableComponentCharacteristics(componentType) {
      // Hide all cable component sections first
      const cableComponentSections = [
        'cat45-connector-section',
        'usb-connector-section',
        'cat45-ethernet-section',
        'vga-cable-section',
        'hdmi-cable-section',
        'hdmi-to-dp-section',
        'vga-to-hdmi-section',
        'vga-to-dp-section',
        'power-cable-section',
        'headphone-adapter-section',
        'printer-cable-section',
        'headphone-cable-section'
      ];
      
      cableComponentSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = 'none';
        }
      });
      
      // Show the selected component section
      const componentSectionMap = {
        'cat45-connector': 'cat45-connector-section',
        'usb-connector': 'usb-connector-section',
        'cat45-ethernet': 'cat45-ethernet-section',
        'vga-cable': 'vga-cable-section',
        'hdmi-cable': 'hdmi-cable-section',
        'hdmi-to-dp': 'hdmi-to-dp-section',
        'vga-to-hdmi': 'vga-to-hdmi-section',
        'vga-to-dp': 'vga-to-dp-section',
        'power-cable': 'power-cable-section',
        'headphone-adapter': 'headphone-adapter-section',
        'printer-cable': 'printer-cable-section',
        'headphone-cable': 'headphone-cable-section'
      };
      
      const targetSectionId = componentSectionMap[componentType];
      if (targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
          targetSection.style.display = 'block';
        }
      }
    }
    
    function isTemplateContent(content) {
      // Check if the content matches any of the template patterns
      const templateKeywords = [
        'Производитель:', 'Разрешение:', 'Тип матрицы:', 'Частота обновления:',
        'Тип подключения:', 'Тип переключателей:', 'Подсветка:', 'Раскладка:',
        'Сенсор:', 'DPI:', 'Количество кнопок:', 'Время работы от батареи:',
        'Архитектура:', 'Количество ядер:', 'Количество потоков:', 'Базовая частота:',
        'Длина кабеля:', 'Количество розеток:', 'Максимальная нагрузка:', 'Защита от перенапряжения:',
        'Количество портов:', 'Скорость портов:', 'Тип управления:', 'Протоколы:',
        'Дисплей:', 'Количество линий:', 'Поддержка HD Voice:', 'Питание:',
        'Активное шумоподавление:', 'Частотный диапазон:', 'Вес:'
      ];
      
      return templateKeywords.some(keyword => content.includes(keyword));
    }
    
    function updateConnectivitySection(selectedType) {
      const connectivitySelect = document.getElementById('equipment-connectivity');
      const connectivityHint = connectivitySelect.parentElement.querySelector('.add-equipment-form-hint');
      
      // Define appropriate connectivity options and defaults for each equipment type
      const connectivityDefaults = {
        'monitor': 'wired',
        'keyboard': 'wireless',
        'mouse': 'wireless',
        'processor': 'integrated',
        'extension-cord': 'not-applicable',
        'additional': 'not-applicable',
        'cables': 'wired',
        'pc-case': 'not-applicable',
        'earphones': 'wireless'
      };
      
      const connectivityHints = {
        'monitor': 'Мониторы обычно подключаются через кабель (HDMI, DisplayPort, USB-C).',
        'keyboard': 'Укажите тип подключения клавиатуры (проводная или беспроводная).',
        'mouse': 'Укажите тип подключения мыши (проводная или беспроводная).',
        'processor': 'Процессоры встроены в материнскую плату.',
        'extension-cord': 'Удлинители не имеют типа подключения в традиционном смысле.',
        'additional': 'Дополнительное оборудование может иметь различные типы подключения.',
        'cables': 'Кабели используются для проводного подключения различных устройств.',
        'pc-case': 'Корпусы ПК не имеют типа подключения - они содержат в себе другие компоненты.',
        'earphones': 'Укажите тип подключения наушников (проводные или беспроводные).'
      };
      
      // Set default value for the equipment type
      const defaultConnectivity = connectivityDefaults[selectedType] || 'wired';
      if (connectivitySelect && !connectivitySelect.hasAttribute('data-user-modified')) {
        connectivitySelect.value = defaultConnectivity;
      }
      
      // Update hint
      if (connectivityHint) {
        connectivityHint.textContent = connectivityHints[selectedType] || 'Укажите тип подключения оборудования.';
      }
      
      // Add listener to track user modifications
      if (connectivitySelect && !connectivitySelect.hasAttribute('data-listener-added')) {
        connectivitySelect.addEventListener('change', function() {
          this.setAttribute('data-user-modified', 'true');
        });
        connectivitySelect.setAttribute('data-listener-added', 'true');
      }
    }
    
    function updateKeyboardButtonsSection(selectedType) {
      const keyboardButtonsSection = document.getElementById('keyboard-buttons-section');
      const keyboardButtonsSelect = document.getElementById('keyboard-buttons');
      
      if (selectedType === 'keyboard') {
        // Show keyboard buttons section for keyboards
        if (keyboardButtonsSection) {
          keyboardButtonsSection.style.display = 'block';
        }
        
        // Set default value if not already set by user
        if (keyboardButtonsSelect && !keyboardButtonsSelect.hasAttribute('data-user-modified')) {
          keyboardButtonsSelect.value = '104'; // Default to full-size keyboard
        }
        
        // Add listener to track user modifications
        if (keyboardButtonsSelect && !keyboardButtonsSelect.hasAttribute('data-listener-added')) {
          keyboardButtonsSelect.addEventListener('change', function() {
            this.setAttribute('data-user-modified', 'true');
          });
          keyboardButtonsSelect.setAttribute('data-listener-added', 'true');
        }
      } else {
        // Hide keyboard buttons section for non-keyboards
        if (keyboardButtonsSection) {
          keyboardButtonsSection.style.display = 'none';
        }
      }
    }
    
    // Form submission
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        let equipmentType = formData.get('equipment-type');
        const name = formData.get('equipment-name');
        const size = formData.get('equipment-size');
        const quality = document.getElementById('quality-toggle').checked ? 'High' : 'Standard';
        const condition = formData.get('equipment-condition');
        const connectivity = formData.get('equipment-connectivity');
        const keyboardButtons = equipmentType === 'keyboard' ? formData.get('keyboard-buttons') : null;
        const quantityValue = formData.get('equipment-quantity');
        
        // Get equipment-specific characteristics
        let characteristics = '';
        
        switch(equipmentType) {
          case 'earphones':
            const earphonesData = {
              id: formData.get('earphones-id') || 'N/A',
              driverSize: formData.get('earphones-driver-size') || 'N/A',
              microphone: document.getElementById('earphones-microphone').checked,
              microphoneType: document.getElementById('earphones-microphone').checked ? formData.get('microphone-type') : 'N/A',
              muteButtom: document.getElementById('earphones-microphone').checked ? document.getElementById('microphone-mute').checked : false,
              audioType: formData.get('earphones-audio-type') || 'Стерео',
              connector: formData.get('earphones-connector') || 'N/A',
              frequency: formData.get('earphones-frequency') || 'N/A'
            };
            characteristics = `ID: ${earphonesData.id}\nРазмер драйвера: ${earphonesData.driverSize}\nМикрофон: ${earphonesData.microphone ? 'Да' : 'Нет'}\nТип микрофона: ${earphonesData.microphoneType}\nКнопка отключения: ${earphonesData.muteButtom ? 'Да' : 'Нет'}\nАудио тип: ${earphonesData.audioType}\nРазъем: ${earphonesData.connector}\nЧастотный диапазон: ${earphonesData.frequency}`;
            break;
            
          case 'monitor':
            const monitorData = {
              resolution: formData.get('monitor-resolution') || 'N/A',
              panel: formData.get('monitor-panel') || 'N/A',
              refresh: formData.get('monitor-refresh') || 'N/A',
              ports: formData.get('monitor-ports') || 'N/A'
            };
            characteristics = `Разрешение: ${monitorData.resolution}\nТип матрицы: ${monitorData.panel}\nЧастота обновления: ${monitorData.refresh} Гц\nПорты: ${monitorData.ports}`;
            break;
            
          case 'keyboard':
            const keyboardData = {
              switchType: formData.get('keyboard-switch') || 'N/A',
              layout: formData.get('keyboard-layout') || 'N/A',
              backlight: document.getElementById('keyboard-backlight').checked,
              interface: formData.get('keyboard-interface') || 'N/A'
            };
            characteristics = `Тип переключателей: ${keyboardData.switchType}\nРаскладка: ${keyboardData.layout}\nПодсветка: ${keyboardData.backlight ? 'Да' : 'Нет'}\nИнтерфейс: ${keyboardData.interface}`;
            break;
            
          case 'mouse':
            const mouseData = {
              dpi: formData.get('mouse-dpi') || 'N/A',
              buttons: formData.get('mouse-buttons') || 'N/A',
              sensor: formData.get('mouse-sensor') || 'N/A',
              polling: formData.get('mouse-polling') || 'N/A'
            };
            characteristics = `DPI: ${mouseData.dpi}\nКоличество кнопок: ${mouseData.buttons}\nТип сенсора: ${mouseData.sensor}\nЧастота опроса: ${mouseData.polling} Гц`;
            break;
            
          case 'pc-case':
            // Get the selected PC component type
            const pcComponentType = formData.get('pc-component-type');
            
            if (!pcComponentType) {
              showNotification('Пожалуйста, выберите тип компонента ПК', 'error');
              return;
            }
            
            // Handle each PC component type
            switch(pcComponentType) {
              case 'processor':
                const processorData = {
                  brand: formData.get('processor-brand') || 'N/A',
                  model: formData.get('processor-model') || 'N/A',
                  cores: formData.get('processor-cores') || 'N/A',
                  threads: formData.get('processor-threads') || 'N/A',
                  baseClock: formData.get('processor-base-clock') || 'N/A',
                  boostClock: formData.get('processor-boost-clock') || 'N/A',
                  socket: formData.get('processor-socket') || 'N/A',
                  tdp: formData.get('processor-tdp') || 'N/A'
                };
                characteristics = `Производитель: ${processorData.brand}\nМодель: ${processorData.model}\nЯдра: ${processorData.cores}\nПотоки: ${processorData.threads}\nБазовая частота: ${processorData.baseClock} ГГц\nМакс. частота: ${processorData.boostClock} ГГц\nСокет: ${processorData.socket}\nTDP: ${processorData.tdp} Вт`;
                break;
                
              case 'motherboard':
                const motherboardData = {
                  formFactor: formData.get('motherboard-form-factor') || 'N/A',
                  socket: formData.get('motherboard-socket') || 'N/A',
                  chipset: formData.get('motherboard-chipset') || 'N/A',
                  ramSlots: formData.get('motherboard-ram-slots') || 'N/A'
                };
                characteristics = `Форм-фактор: ${motherboardData.formFactor}\nСокет: ${motherboardData.socket}\nЧипсет: ${motherboardData.chipset}\nСлоты ОЗУ: ${motherboardData.ramSlots}`;
                break;
                
              case 'ram':
                const ramData = {
                  type: formData.get('ram-type') || 'N/A',
                  capacity: formData.get('ram-capacity') || 'N/A',
                  speed: formData.get('ram-speed') || 'N/A',
                  modules: formData.get('ram-modules') || 'N/A'
                };
                characteristics = `Тип: ${ramData.type}\nОбъем: ${ramData.capacity} ГБ\nЧастота: ${ramData.speed} МГц\nМодули: ${ramData.modules}`;
                break;
                
              case 'gpu':
                const gpuData = {
                  brand: formData.get('gpu-brand') || 'N/A',
                  model: formData.get('gpu-model') || 'N/A',
                  vram: formData.get('gpu-vram') || 'N/A',
                  length: formData.get('gpu-length') || 'N/A'
                };
                characteristics = `Производитель: ${gpuData.brand}\nМодель: ${gpuData.model}\nVRAM: ${gpuData.vram} ГБ\nДлина: ${gpuData.length} мм`;
                break;
                
              case 'storage':
                const storageData = {
                  type: formData.get('storage-type') || 'N/A',
                  capacity: formData.get('storage-capacity') || 'N/A',
                  interface: formData.get('storage-interface') || 'N/A',
                  speed: formData.get('storage-speed') || 'N/A'
                };
                characteristics = `Тип: ${storageData.type}\nОбъем: ${storageData.capacity} ГБ\nИнтерфейс: ${storageData.interface}\nСкорость чтения: ${storageData.speed} МБ/с`;
                break;
                
              case 'power-supply':
                const psuData = {
                  wattage: formData.get('psu-wattage') || 'N/A',
                  efficiency: formData.get('psu-efficiency') || 'N/A',
                  modular: formData.get('psu-modular') || 'N/A',
                  formFactor: formData.get('psu-form-factor') || 'N/A'
                };
                characteristics = `Мощность: ${psuData.wattage} Вт\nЭффективность: ${psuData.efficiency}\nМодульность: ${psuData.modular}\nФорм-фактор: ${psuData.formFactor}`;
                break;
                
              case 'cooling':
                const coolingData = {
                  type: formData.get('cooling-type') || 'N/A',
                  height: formData.get('cooling-height') || 'N/A',
                  socketSupport: formData.get('cooling-socket-support') || 'N/A',
                  tdp: formData.get('cooling-tdp') || 'N/A'
                };
                characteristics = `Тип: ${coolingData.type}\nВысота: ${coolingData.height} мм\nПоддержка сокетов: ${coolingData.socketSupport}\nМакс. TDP: ${coolingData.tdp} Вт`;
                break;
                
              case 'case-component':
                const caseData = {
                  motherboard: formData.get('case-motherboard') || 'N/A',
                  gpuLength: formData.get('case-gpu-length') || 'N/A',
                  coolerHeight: formData.get('case-cooler-height') || 'N/A',
                  fans: formData.get('case-fans') || 'N/A'
                };
                characteristics = `Поддержка МП: ${caseData.motherboard}\nМакс. длина GPU: ${caseData.gpuLength} мм\nМакс. высота кулера: ${caseData.coolerHeight} мм\nВентиляторы: ${caseData.fans}`;
                break;
                
              default:
                characteristics = 'Характеристики компонента не указаны';
            }
            
            // Store the component type for later use
            equipmentType = pcComponentType; // This will be used as the actual equipment type
            break;
            
          case 'other':
            // Get the selected Other component type
            const otherComponentType = formData.get('other-component-type');
            
            if (!otherComponentType) {
              showNotification('Пожалуйста, выберите тип оборудования', 'error');
              return;
            }
            
            // Handle each Other component type
            switch(otherComponentType) {
              case 'switch':
                const switchData = {
                  ports: formData.get('switch-ports') || 'N/A',
                  speed: formData.get('switch-speed') || 'N/A',
                  managed: formData.get('switch-managed') || 'N/A',
                  poe: formData.get('switch-poe') || 'N/A'
                };
                characteristics = `Порты: ${switchData.ports}\nСкорость: ${switchData.speed}\nУправление: ${switchData.managed}\nPoE: ${switchData.poe}`;
                break;
                
              case 'ups':
                const upsData = {
                  power: formData.get('ups-power') || 'N/A',
                  runtime: formData.get('ups-runtime') || 'N/A',
                  type: formData.get('ups-type') || 'N/A',
                  outlets: formData.get('ups-outlets') || 'N/A'
                };
                characteristics = `Мощность: ${upsData.power} ВА\nВремя работы: ${upsData.runtime} мин\nТип: ${upsData.type}\nРозетки: ${upsData.outlets}`;
                break;
                
              case 'ip-telephony':
                const phoneData = {
                  lines: formData.get('phone-lines') || 'N/A',
                  display: formData.get('phone-display') || 'N/A',
                  poe: formData.get('phone-poe') || 'N/A',
                  headset: formData.get('phone-headset') || 'N/A'
                };
                characteristics = `Линии: ${phoneData.lines}\nДисплей: ${phoneData.display}\nPoE: ${phoneData.poe}\nГарнитура: ${phoneData.headset}`;
                break;
                
              case 'projector':
                const projectorData = {
                  resolution: formData.get('projector-resolution') || 'N/A',
                  brightness: formData.get('projector-brightness') || 'N/A',
                  technology: formData.get('projector-technology') || 'N/A',
                  lampLife: formData.get('projector-lamp-life') || 'N/A'
                };
                characteristics = `Разрешение: ${projectorData.resolution}\nЯркость: ${projectorData.brightness} люмен\nТехнология: ${projectorData.technology}\nСрок лампы: ${projectorData.lampLife} ч`;
                break;
                
              case 'notebook':
                const notebookData = {
                  cpu: formData.get('notebook-cpu') || 'N/A',
                  ram: formData.get('notebook-ram') || 'N/A',
                  storage: formData.get('notebook-storage') || 'N/A',
                  screen: formData.get('notebook-screen') || 'N/A',
                  gpu: formData.get('notebook-gpu') || 'N/A',
                  os: formData.get('notebook-os') || 'N/A'
                };
                characteristics = `Процессор: ${notebookData.cpu}\nОЗУ: ${notebookData.ram}\nНакопитель: ${notebookData.storage}\nЭкран: ${notebookData.screen}\nВидеокарта: ${notebookData.gpu}\nОС: ${notebookData.os}`;
                break;
                
              case 'printer':
                const printerData = {
                  type: formData.get('printer-type') || 'N/A',
                  color: formData.get('printer-color') || 'N/A',
                  functions: formData.get('printer-functions') || 'N/A',
                  cartridge: formData.get('printer-cartridge') || 'N/A',
                  connectivity: formData.get('printer-connectivity') || 'N/A',
                  speed: formData.get('printer-speed') || 'N/A'
                };
                characteristics = `Тип: ${printerData.type}\nЦвет: ${printerData.color}\nФункции: ${printerData.functions}\nКартридж: ${printerData.cartridge}\nПодключение: ${printerData.connectivity}\nСкорость: ${printerData.speed} стр/мин`;
                break;
                
              case 'tv':
                const tvData = {
                  size: formData.get('tv-size') || 'N/A',
                  resolution: formData.get('tv-resolution') || 'N/A',
                  technology: formData.get('tv-technology') || 'N/A',
                  smart: formData.get('tv-smart') || 'N/A',
                  hdmi: formData.get('tv-hdmi') || 'N/A',
                  refresh: formData.get('tv-refresh') || 'N/A'
                };
                characteristics = `Диагональ: ${tvData.size}"\nРазрешение: ${tvData.resolution}\nТехнология: ${tvData.technology}\nSmart TV: ${tvData.smart}\nHDMI: ${tvData.hdmi}\nЧастота: ${tvData.refresh}`;
                break;
                
              case 'switch-media':
                const switchMediaData = {
                  ports: formData.get('switch-ports') || 'N/A',
                  speed: formData.get('switch-speed') || 'N/A',
                  managed: formData.get('switch-managed') || 'N/A',
                  poe: formData.get('switch-poe') || 'N/A'
                };
                characteristics = `Порты: ${switchMediaData.ports}\nСкорость: ${switchMediaData.speed}\nУправление: ${switchMediaData.managed}\nPoE: ${switchMediaData.poe}`;
                break;
                
              default:
                characteristics = 'Характеристики оборудования не указаны';
            }
            
            // Store the component type for later use
            equipmentType = otherComponentType; // This will be used as the actual equipment type
            break;
            
          case 'cables':
            // Get the selected Cable component type
            const cableComponentType = formData.get('cable-component-type');
            
            if (!cableComponentType) {
              showNotification('Пожалуйста, выберите тип кабеля', 'error');
              return;
            }
            
            // Handle each Cable component type
            switch(cableComponentType) {
              case 'cat45-connector':
                const cat45ConnectorData = {
                  id: formData.get('cat45-connector-id') || 'N/A',
                  category: formData.get('cat45-connector-category') || 'N/A',
                  shielding: formData.get('cat45-connector-shielding') || 'N/A',
                  pins: formData.get('cat45-connector-pins') || 'N/A'
                };
                characteristics = `ID: ${cat45ConnectorData.id}\nКатегория: ${cat45ConnectorData.category}\nЭкранирование: ${cat45ConnectorData.shielding}\nКонтакты: ${cat45ConnectorData.pins}`;
                break;
                
              case 'usb-connector':
                const usbConnectorData = {
                  id: formData.get('usb-connector-id') || 'N/A',
                  version: formData.get('usb-connector-version') || 'N/A',
                  length: formData.get('usb-connector-length') || 'N/A',
                  type: formData.get('usb-connector-type') || 'N/A'
                };
                characteristics = `ID: ${usbConnectorData.id}\nВерсия: ${usbConnectorData.version}\nДлина: ${usbConnectorData.length}м\nТип: ${usbConnectorData.type}`;
                break;
                
              case 'cat45-ethernet':
                const cat45EthernetData = {
                  id: formData.get('cat45-ethernet-id') || 'N/A',
                  length: formData.get('cat45-ethernet-length') || 'N/A',
                  category: formData.get('cat45-ethernet-category') || 'N/A',
                  speed: formData.get('cat45-ethernet-speed') || 'N/A'
                };
                characteristics = `ID: ${cat45EthernetData.id}\nДлина: ${cat45EthernetData.length}м\nКатегория: ${cat45EthernetData.category}\nСкорость: ${cat45EthernetData.speed}`;
                break;
                
              case 'vga-cable':
                const vgaCableData = {
                  id: formData.get('vga-cable-id') || 'N/A',
                  length: formData.get('vga-cable-length') || 'N/A',
                  resolution: formData.get('vga-cable-resolution') || 'N/A',
                  connector: formData.get('vga-cable-connector') || 'N/A'
                };
                characteristics = `ID: ${vgaCableData.id}\nДлина: ${vgaCableData.length}м\nРазрешение: ${vgaCableData.resolution}\nРазъем: ${vgaCableData.connector}`;
                break;
                
              case 'hdmi-cable':
                const hdmiCableData = {
                  id: formData.get('hdmi-cable-id') || 'N/A',
                  length: formData.get('hdmi-cable-length') || 'N/A',
                  version: formData.get('hdmi-cable-version') || 'N/A',
                  resolution: formData.get('hdmi-cable-resolution') || 'N/A'
                };
                characteristics = `ID: ${hdmiCableData.id}\nДлина: ${hdmiCableData.length}м\nВерсия: ${hdmiCableData.version}\nРазрешение: ${hdmiCableData.resolution}`;
                break;
                
              case 'hdmi-to-dp':
                const hdmiToDpData = {
                  id: formData.get('hdmi-to-dp-id') || 'N/A',
                  length: formData.get('hdmi-to-dp-length') || 'N/A',
                  hdmiVersion: formData.get('hdmi-to-dp-hdmi-version') || 'N/A',
                  dpVersion: formData.get('hdmi-to-dp-dp-version') || 'N/A'
                };
                characteristics = `ID: ${hdmiToDpData.id}\nДлина: ${hdmiToDpData.length}м\nHDMI: ${hdmiToDpData.hdmiVersion}\nDisplayPort: ${hdmiToDpData.dpVersion}`;
                break;
                
              case 'vga-to-hdmi':
                const vgaToHdmiData = {
                  id: formData.get('vga-to-hdmi-id') || 'N/A',
                  length: formData.get('vga-to-hdmi-length') || 'N/A',
                  audio: document.getElementById('vga-to-hdmi-audio').checked,
                  resolution: formData.get('vga-to-hdmi-resolution') || 'N/A'
                };
                characteristics = `ID: ${vgaToHdmiData.id}\nДлина: ${vgaToHdmiData.length}м\nАудио: ${vgaToHdmiData.audio ? 'Да' : 'Нет'}\nРазрешение: ${vgaToHdmiData.resolution}`;
                break;
                
              case 'vga-to-dp':
                const vgaToDpData = {
                  id: formData.get('vga-to-dp-id') || 'N/A',
                  length: formData.get('vga-to-dp-length') || 'N/A',
                  dpVersion: formData.get('vga-to-dp-dp-version') || 'N/A',
                  resolution: formData.get('vga-to-dp-resolution') || 'N/A'
                };
                characteristics = `ID: ${vgaToDpData.id}\nДлина: ${vgaToDpData.length}м\nDisplayPort: ${vgaToDpData.dpVersion}\nРазрешение: ${vgaToDpData.resolution}`;
                break;
                
              case 'power-cable':
                const powerCableData = {
                  id: formData.get('power-cable-id') || 'N/A',
                  length: formData.get('power-cable-length') || 'N/A',
                  voltage: formData.get('power-cable-voltage') || 'N/A',
                  connector: formData.get('power-cable-connector') || 'N/A'
                };
                characteristics = `ID: ${powerCableData.id}\nДлина: ${powerCableData.length}м\nНапряжение: ${powerCableData.voltage}\nРазъем: ${powerCableData.connector}`;
                break;
                
              case 'headphone-adapter':
                const headphoneAdapterData = {
                  id: formData.get('headphone-adapter-id') || 'N/A',
                  input: formData.get('headphone-adapter-input') || 'N/A',
                  output: formData.get('headphone-adapter-output') || 'N/A',
                  dac: document.getElementById('headphone-adapter-dac').checked
                };
                characteristics = `ID: ${headphoneAdapterData.id}\nВход: ${headphoneAdapterData.input}\nВыход: ${headphoneAdapterData.output}\nЦАП: ${headphoneAdapterData.dac ? 'Да' : 'Нет'}`;
                break;
                
              case 'printer-cable':
                const printerCableData = {
                  id: formData.get('printer-cable-id') || 'N/A',
                  length: formData.get('printer-cable-length') || 'N/A',
                  type: formData.get('printer-cable-type') || 'N/A',
                  version: formData.get('printer-cable-version') || 'N/A'
                };
                characteristics = `ID: ${printerCableData.id}\nДлина: ${printerCableData.length}м\nТип: ${printerCableData.type}\nВерсия: ${printerCableData.version}`;
                break;
                
              case 'headphone-cable':
                const headphoneCableData = {
                  id: formData.get('headphone-cable-id') || 'N/A',
                  length: formData.get('headphone-cable-length') || 'N/A',
                  connector: formData.get('headphone-cable-connector') || 'N/A',
                  channels: formData.get('headphone-cable-channels') || 'N/A'
                };
                characteristics = `ID: ${headphoneCableData.id}\nДлина: ${headphoneCableData.length}м\nРазъем: ${headphoneCableData.connector}\nКаналы: ${headphoneCableData.channels}`;
                break;
                
              default:
                characteristics = 'Характеристики кабеля не указаны';
            }
            
            // Store the component type for later use
            equipmentType = cableComponentType; // This will be used as the actual equipment type
            break;
            
          default:
            characteristics = formData.get('equipment-characteristics') || 'Дополнительные характеристики недоступны';
        }
        
        // Validate quantity
        const quantity = parseInt(quantityValue);
        if (isNaN(quantity) || quantity <= 0) {
          showNotification('Пожалуйста, введите корректное количество (больше 0)', 'error');
          return;
        }
        
        // Validate required fields
        if (!equipmentType || !name || !condition || !connectivity) {
          showNotification('Пожалуйста, заполните все обязательные поля', 'error');
          return;
        }
        
        // Check if we're editing an existing item
        const editingId = form.getAttribute('data-editing-id');
        
        if (editingId) {
          // Update existing equipment
          const existingItemIndex = equipmentData.findIndex(item => item.id === editingId);
          if (existingItemIndex !== -1) {
            equipmentData[existingItemIndex] = {
              id: editingId, // Keep the original ID
              type: equipmentType,
              name: name,
              size: size || 'N/A',
              quality: quality,
              condition: condition,
              connectivity: connectivity,
              keyboardButtons: keyboardButtons,
              quantity: quantity,
              dateAdded: equipmentData[existingItemIndex].dateAdded, // Keep original date
              characteristics: characteristics || 'Дополнительные характеристики недоступны'
            };
            
            showNotification('Оборудование успешно обновлено!', 'success');
          }
          
          // Clear editing state
          form.removeAttribute('data-editing-id');
          document.getElementById('add-equipment-submit-btn').textContent = 'Добавить';
        } else {
          // Generate new equipment ID
          const typePrefix = equipmentType.toUpperCase().substring(0, 3);
          const existingItems = equipmentData.filter(item => item.type === equipmentType);
          const newNumber = String(existingItems.length + 1).padStart(3, '0');
          const newId = typePrefix + newNumber;
          
          // Create new equipment item
          const newEquipment = {
            id: newId,
            type: equipmentType,
            name: name,
            size: size || 'N/A',
            quality: quality,
            condition: condition,
            connectivity: connectivity,
            keyboardButtons: keyboardButtons,
            quantity: quantity,
            dateAdded: new Date().toISOString().split('T')[0],
            characteristics: characteristics || 'Дополнительные характеристики недоступны'
          };
          
          // Add to equipment data
          equipmentData.push(newEquipment);
          
          showNotification('Оборудование успешно добавлено!', 'success');
        }
        
        // Update display
        loadEquipmentData();
        updateStatistics();
        
        // Reset form
        form.reset();
        qualityLabel.textContent = 'Стандартное качество';
        updateSizeSection();
        
        // Reset connectivity field user modification flag
        const connectivitySelect = document.getElementById('equipment-connectivity');
        if (connectivitySelect) {
          connectivitySelect.removeAttribute('data-user-modified');
        }
        
        // Reset keyboard buttons field user modification flag
        const keyboardButtonsSelect = document.getElementById('keyboard-buttons');
        if (keyboardButtonsSelect) {
          keyboardButtonsSelect.removeAttribute('data-user-modified');
        }
      });
    }
    
    // Initialize size section based on default selection
    updateSizeSection();
  }
  
  // Initialize search functionality
  function initializeSearch() {
    const searchInput = document.getElementById('equipment-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterEquipment(searchTerm);
      });
    }
  }
  
  // Initialize filter functionality
  function initializeFilter() {
    const filterSelect = document.getElementById('equipment-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', function() {
        const filterType = this.value;
        
        // Remove active class from all stat items
        document.querySelectorAll('.stat-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // If a specific type is selected, highlight the corresponding stat item
        if (filterType) {
          const statItem = document.querySelector(`[data-type="${filterType}"]`);
          if (statItem) {
            statItem.classList.add('active');
          }
        }
        
        filterEquipmentByType(filterType);
      });
    }
    
    // Add click handler to stats title for clearing filters
    const statsTitle = document.querySelector('.stats-title');
    if (statsTitle) {
      statsTitle.addEventListener('click', function() {
        // Clear all filters
        const filterSelect = document.getElementById('equipment-filter');
        if (filterSelect) {
          filterSelect.value = '';
        }
        
        // Remove active class from all stat items
        document.querySelectorAll('.stat-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Show all equipment
        renderEquipmentTable(equipmentData);
        showNotification('Фильтры очищены', 'info');
      });
      
      // Make it look clickable
      statsTitle.style.cursor = 'pointer';
      statsTitle.title = 'Нажмите для очистки фильтров';
    }
  }
  
  // Filter equipment by search term
  function filterEquipment(searchTerm) {
    const filteredData = equipmentData.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm)
    );
    renderEquipmentTable(filteredData);
  }
  
  // Filter equipment by type
  function filterEquipmentByType(type) {
    let filteredData;
    
    if (!type) {
      filteredData = equipmentData;
    } else if (type === 'pc-case') {
      // For PC Case, show all PC components
      const pcComponentTypes = ['processor', 'motherboard', 'ram', 'gpu', 'storage', 'power-supply', 'cooling', 'case-component'];
      filteredData = equipmentData.filter(item => pcComponentTypes.includes(item.type));
    } else if (type === 'cables') {
      // For Cables, show all Cable components
      const cableComponentTypes = ['cat45-connector', 'usb-connector', 'cat45-ethernet', 'vga-cable', 'hdmi-cable', 'hdmi-to-dp', 'vga-to-hdmi', 'vga-to-dp', 'power-cable', 'headphone-adapter', 'printer-cable', 'headphone-cable'];
      filteredData = equipmentData.filter(item => cableComponentTypes.includes(item.type));
    } else if (type === 'other') {
      // For Other, show all Other components
      const otherComponentTypes = ['switch', 'ups', 'ip-telephony', 'projector', 'notebook', 'printer', 'tv'];
      filteredData = equipmentData.filter(item => otherComponentTypes.includes(item.type));
    } else {
      filteredData = equipmentData.filter(item => item.type === type);
    }
    
    renderEquipmentTable(filteredData);
  }
  
  // Load and display equipment data
  function loadEquipmentData() {
    renderEquipmentTable(equipmentData);
    updateStatistics();
  }
  
  // Render equipment table
  function renderEquipmentTable(data) {
    const tbody = document.getElementById('equipment-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // If no data is provided, use all equipment data
    if (!data) {
      data = equipmentData;
    }
    
    data.forEach((item, index) => {
      // Ensure quantity is a valid number
      const quantity = isNaN(item.quantity) ? 0 : item.quantity;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><span class="equipment-type-badge ${item.type}">${translateEquipmentType(item.type)}</span></td>
        <td>${item.name}</td>
        <td>${item.size}</td>
        <td><span class="quality-badge ${item.quality.toLowerCase()}">${translateQuality(item.quality)}</span></td>
        <td><span class="condition-badge ${item.condition.toLowerCase()}">${translateCondition(item.condition)}</span></td>
        <td><span class="connectivity-badge ${item.connectivity}">${translateConnectivity(item.connectivity)}</span></td>
        <td>${quantity}</td>
        <td>${formatDate(item.dateAdded)}</td>
        <td>
          
        <div class="action-buttons">
            <button class="action-btn view-btn" onclick="viewCharacteristics('${item.id}')" title="Просмотр характеристик">
              <span class="material-icons">visibility</span>
            </button>
            <button class="action-btn edit-btn" onclick="editEquipment('${item.id}')" title="Редактировать оборудование">
              <span class="material-icons">edit</span>
            </button>
            <button class="action-btn delete-btn" onclick="deleteEquipment('${item.id}')" title="Удалить оборудование">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Update statistics
  function updateStatistics() {
    // Calculate items by type (for equipment types)
    const monitorCount = equipmentData.filter(item => item.type === 'monitor').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const keyboardCount = equipmentData.filter(item => item.type === 'keyboard').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const mouseCount = equipmentData.filter(item => item.type === 'mouse').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const earphonesCount = equipmentData.filter(item => item.type === 'earphones').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    
    // Calculate PC components by type
    const processorCount = equipmentData.filter(item => item.type === 'processor').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const motherboardCount = equipmentData.filter(item => item.type === 'motherboard').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const ramCount = equipmentData.filter(item => item.type === 'ram').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const gpuCount = equipmentData.filter(item => item.type === 'gpu').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const storageCount = equipmentData.filter(item => item.type === 'storage').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const powerSupplyCount = equipmentData.filter(item => item.type === 'power-supply').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const coolingCount = equipmentData.filter(item => item.type === 'cooling').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const caseComponentCount = equipmentData.filter(item => item.type === 'case-component').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    
    // Calculate Other components by type
    const switchCount = equipmentData.filter(item => item.type === 'switch').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const switchMediaCount = equipmentData.filter(item => item.type === 'switch-media').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const upsCount = equipmentData.filter(item => item.type === 'ups').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const ipTelephonyCount = equipmentData.filter(item => item.type === 'ip-telephony').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const projectorCount = equipmentData.filter(item => item.type === 'projector').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const notebookCount = equipmentData.filter(item => item.type === 'notebook').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const printerCount = equipmentData.filter(item => item.type === 'printer').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const tvCount = equipmentData.filter(item => item.type === 'tv').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    
    // Calculate Cable components by type
    const cat45ConnectorCount = equipmentData.filter(item => item.type === 'cat45-connector').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const usbConnectorCount = equipmentData.filter(item => item.type === 'usb-connector').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const cat45EthernetCount = equipmentData.filter(item => item.type === 'cat45-ethernet').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const vgaCableCount = equipmentData.filter(item => item.type === 'vga-cable').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const hdmiCableCount = equipmentData.filter(item => item.type === 'hdmi-cable').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const hdmiToDpCount = equipmentData.filter(item => item.type === 'hdmi-to-dp').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const vgaToHdmiCount = equipmentData.filter(item => item.type === 'vga-to-hdmi').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const vgaToDpCount = equipmentData.filter(item => item.type === 'vga-to-dp').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const powerCableCount = equipmentData.filter(item => item.type === 'power-cable').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const headphoneAdapterCount = equipmentData.filter(item => item.type === 'headphone-adapter').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const printerCableCount = equipmentData.filter(item => item.type === 'printer-cable').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    const headphoneCableCount = equipmentData.filter(item => item.type === 'headphone-cable').reduce((sum, item) => sum + (isNaN(item.quantity) ? 0 : item.quantity), 0);
    
    // Total PC Case count (sum of all PC components)
    const pcCaseCount = processorCount + motherboardCount + ramCount + gpuCount + storageCount + powerSupplyCount + coolingCount + caseComponentCount;
    
    // Total Other count (sum of all Other components)
    const otherCount = switchCount + switchMediaCount + upsCount + ipTelephonyCount + projectorCount + notebookCount + printerCount + tvCount;
    
    const totalCount = monitorCount + keyboardCount + mouseCount + pcCaseCount + earphonesCount + otherCount;
    
    // Update stat displays
    updateStatDisplay('monitor-count', monitorCount);
    updateStatDisplay('keyboard-count', keyboardCount);
    updateStatDisplay('mouse-count', mouseCount);
    updateStatDisplay('pc-case-count', pcCaseCount);
    updateStatDisplay('earphones-count', earphonesCount);
    updateStatDisplay('other-count', otherCount);
    
    // Update total count
    const totalElement = document.getElementById('total-equipment-count');
    if (totalElement) {
      totalElement.textContent = totalCount;
    }
  }

  // Function to update individual stat display
  function updateStatDisplay(elementId, count) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = count;
  }

  // Global filter function for stat items
  window.filterByType = function(type) {
    // Remove active class from all stat items
    document.querySelectorAll('.stat-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked item
    const clickedItem = document.querySelector(`[data-type="${type}"]`);
    if (clickedItem) {
      clickedItem.classList.add('active');
    }
    
    // Update the filter dropdown
    const filterSelect = document.getElementById('equipment-filter');
    if (filterSelect) {
      filterSelect.value = type;
    }
    
    // Filter the equipment table
    filterEquipmentByType(type);
    
    // Add a subtle visual feedback
    showNotification(`Фильтрация по типу: ${translateEquipmentType(type)}`, 'info');
  };
  
  // Utility functions
  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
  
  // Global functions for edit/delete actions
  window.editEquipment = function(id) {
    const equipment = equipmentData.find(item => item.id === id);
    if (equipment) {
      // Fill form with equipment data
      document.querySelector(`input[name="equipment-type"][value="${equipment.type}"]`).checked = true;
      document.getElementById('equipment-name').value = equipment.name;
      document.getElementById('equipment-size').value = equipment.size;
      document.getElementById('quality-toggle').checked = equipment.quality === 'High';
      document.getElementById('quality-label').textContent = equipment.quality === 'High' ? 'Высокое качество' : 'Стандартное качество';
      document.getElementById('equipment-condition').value = equipment.condition;
      document.getElementById('equipment-connectivity').value = equipment.connectivity || 'wired';
      if (equipment.type === 'keyboard' && equipment.keyboardButtons) {
        document.getElementById('keyboard-buttons').value = equipment.keyboardButtons;
      }
      document.getElementById('equipment-characteristics').value = equipment.characteristics;
      document.getElementById('equipment-quantity').value = equipment.quantity;
      
      // Store the ID being edited for later use
      document.getElementById('add-equipment-form').setAttribute('data-editing-id', id);
      
      // Change form button text to indicate editing
      document.getElementById('add-equipment-submit-btn').textContent = 'Обновить оборудование';
      
      // Update size section based on equipment type
      const event = new Event('change');
      document.querySelector(`input[name="equipment-type"][value="${equipment.type}"]`).dispatchEvent(event);
      
      showNotification('Оборудование загружено для редактирования', 'info');
    }
  };
  
  window.deleteEquipment = function(id) {
    if (confirm('Вы уверены, что хотите удалить это оборудование?')) {
      equipmentData = equipmentData.filter(item => item.id !== id);
      loadEquipmentData();
      showNotification('Оборудование успешно удалено', 'success');
    }
  };

  // View characteristics function
  window.viewCharacteristics = function(id) {
    const equipment = equipmentData.find(item => item.id === id);
    if (equipment) {
      showCharacteristicsModal(equipment);
    }
  };

  // Show characteristics modal
  function showCharacteristicsModal(equipment) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.characteristics-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal HTML
    const modalHTML = `
      <div class="characteristics-modal">
        <div class="characteristics-modal-content">
          <div class="characteristics-modal-header">
            <h3 class="characteristics-modal-title">Детали оборудования</h3>
            <button class="characteristics-modal-close" onclick="closeCharacteristicsModal()">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div class="characteristics-modal-body">
            <div class="equipment-details">
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">ID оборудования:</span>
                <span class="equipment-detail-value">${equipment.id}</span>
              </div>
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Название:</span>
                <span class="equipment-detail-value">${equipment.name}</span>
              </div>
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Тип:</span>
                <span class="equipment-detail-value">
                  <span class="equipment-type-badge ${equipment.type}">${translateEquipmentType(equipment.type)}</span>
                </span>
              </div>
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Размер:</span>
                <span class="equipment-detail-value">${equipment.size}</span>
              </div>
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Качество:</span>
                <span class="equipment-detail-value">
                  <span class="quality-badge ${equipment.quality.toLowerCase()}">${translateQuality(equipment.quality)}</span>
                </span>
              </div>
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Состояние:</span>
                <span class="equipment-detail-value">
                  <span class="condition-badge ${equipment.condition.toLowerCase()}">${translateCondition(equipment.condition)}</span>
                </span>
              </div>
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Подключение:</span>
                <span class="equipment-detail-value">
                  <span class="connectivity-badge ${equipment.connectivity}">${translateConnectivity(equipment.connectivity || 'not-applicable')}</span>
                </span>
              </div>
              ${equipment.type === 'keyboard' && equipment.keyboardButtons ? `
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Количество клавиш:</span>
                <span class="equipment-detail-value">${equipment.keyboardButtons === 'other' ? 'Другое' : equipment.keyboardButtons + ' клавиш'}</span>
              </div>
              ` : ''}
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Количество:</span>
                <span class="equipment-detail-value">${equipment.quantity}</span>
              </div>
              <div class="equipment-detail-row">
                <span class="equipment-detail-label">Дата добавления:</span>
                <span class="equipment-detail-value">${formatDate(equipment.dateAdded)}</span>
              </div>
            </div>
            <div class="characteristics-content">
              <div class="characteristics-title">Характеристики</div>
              <div class="characteristics-text">${equipment.characteristics || 'Дополнительные характеристики недоступны.'}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add click outside to close
    const modal = document.querySelector('.characteristics-modal');
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeCharacteristicsModal();
      }
    });
  }

  // Close characteristics modal
  window.closeCharacteristicsModal = function() {
    const modal = document.querySelector('.characteristics-modal');
    if (modal) {
      modal.remove();
    }
  };
  
  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles for notifications if not already present
    if (!notification.style.position) {
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.right = '20px';
      notification.style.padding = '16px 20px';
      notification.style.borderRadius = '8px';
      notification.style.color = 'white';
      notification.style.fontWeight = '500';
      notification.style.zIndex = '1001';
      notification.style.transform = 'translateX(100%)';
      notification.style.transition = 'transform 0.3s ease';
      notification.style.maxWidth = '300px';
      notification.style.wordWrap = 'break-word';
      
      // Set background color based on type
      switch (type) {
        case 'success':
          notification.style.background = '#4caf50';
          break;
        case 'error':
          notification.style.background = '#f44336';
          break;
        case 'info':
        default:
          notification.style.background = '#2196f3';
          break;
      }
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Hide notification after 4 seconds (longer for error messages)
    const hideDelay = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, hideDelay);
  }
  
  // Initialize the dashboard
  initWarehouseDashboard();
  
  // Ensure warehouse dashboard is hidden by default on page load
  const warehouseDashboard = document.getElementById('warehouse-dashboard');
  const defaultPlaceholder = document.getElementById('default-placeholder');
  if (warehouseDashboard) warehouseDashboard.style.display = 'none';
  if (defaultPlaceholder) defaultPlaceholder.style.display = 'block';
});
