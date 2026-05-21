/* Premium JavaScript for MCS Tours Website */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // 2. Smooth Scroll & Active Nav State on Scroll
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust threshold offset for sticky header height
            if (scrollPosition >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // 3. Fleet Filter Tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    const fleetCards = document.querySelectorAll('.fleet-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            fleetCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade-out effect
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade-in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });


    // 4. FAQ Accordion
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqContent = faqItem.querySelector('.faq-content');
            const isActive = faqItem.classList.contains('active');

            // Collapse all other active FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-content').style.maxHeight = null;
                }
            });

            // Toggle current FAQ item
            if (isActive) {
                faqItem.classList.remove('active');
                faqContent.style.maxHeight = null;
            } else {
                faqItem.classList.add('active');
                faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
            }
        });
    });


    // 5. Dynamic Estimated Fare Calculator
    const calcForm = document.getElementById('calcForm');
    const calcResult = document.getElementById('calcResult');
    const resVehicle = document.getElementById('resVehicle');
    const resDistance = document.getElementById('resDistance');
    const resPrice = document.getElementById('resPrice');
    const calcDisclaimer = document.getElementById('calcDisclaimer');
    const whatsappCalcBtn = document.getElementById('whatsappCalcBtn');

    if (calcForm) {
        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const vehicleSelect = document.getElementById('vehicleSelect');
            const selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
            const vehicleType = vehicleSelect.value;
            const rateType = selectedOption.getAttribute('data-rate');
            
            const distance = parseFloat(document.getElementById('distanceInput').value);
            const tripType = document.getElementById('tripType').value;

            let vehicleNameFormatted = selectedOption.text.split(' - ')[0].split(' (')[0];
            let distanceText = `${distance} KM (${tripType === 'one-way' ? 'One-Way' : 'Round-Trip'})`;
            let priceText = '';
            let isCustom = rateType === 'custom';
            let calculatedTotal = 0;

            // Calculate price if not custom
            if (!isCustom) {
                const rate = parseFloat(rateType);
                const multiplier = tripType === 'round-trip' ? 2 : 1;
                const totalDistance = distance * multiplier;
                calculatedTotal = totalDistance * rate;
                priceText = `Rs. ${calculatedTotal.toLocaleString()}`;
                calcDisclaimer.style.display = 'block';
            } else {
                priceText = 'Quote Required';
                calcDisclaimer.style.display = 'none';
            }

            // Update UI fields
            resVehicle.textContent = vehicleNameFormatted;
            resDistance.textContent = distanceText;
            resPrice.textContent = priceText;

            // Generate WhatsApp Link
            const phoneNumber = '94772311633';
            let waText = '';

            if (!isCustom) {
                waText = `Hi MCS Tours,\n\nI want to book a ${vehicleNameFormatted} for a trip.\nDetails:\n- Trip Type: ${tripType === 'one-way' ? 'One-Way' : 'Round-Trip'}\n- Distance: ${distance} KM\n- Estimated Fare: Rs. ${calculatedTotal.toLocaleString()}\n\nPlease confirm availability and details.`;
            } else {
                waText = `Hi MCS Tours,\n\nI want to get a price quote for a ${vehicleNameFormatted}.\nDetails:\n- Trip Type: ${tripType === 'one-way' ? 'One-Way' : 'Round-Trip'}\n- Distance: ${distance} KM\n\nPlease let me know the custom rates for this hire.`;
            }

            const encodedText = encodeURIComponent(waText);
            whatsappCalcBtn.href = `https://wa.me/${phoneNumber}?text=${encodedText}`;

            // Show results block with transition
            calcResult.style.display = 'block';
            calcResult.style.opacity = '0';
            setTimeout(() => {
                calcResult.style.transition = 'opacity 0.4s ease';
                calcResult.style.opacity = '1';
            }, 50);
            
            // Scroll result into view smoothly
            setTimeout(() => {
                calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        });
    }

});
