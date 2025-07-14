import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { CreditCard, Shield, TrendingUp, DollarSign, Calculator, MapPin, CircleCheck as CheckCircle, ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface FinanceService {
  id: string;
  title: string;
  description: string;
  icon: any;
  interestRate?: string;
  eligibility: string[];
  features: string[];
}

const financeServices: FinanceService[] = [
  {
    id: '1',
    title: 'Kisan Credit Card',
    description: 'Flexible credit facility for farmers to meet agricultural expenses',
    icon: CreditCard,
    interestRate: '7-9% p.a.',
    eligibility: ['Land ownership documents', 'Bank account', 'ID proof'],
    features: ['Flexible repayment', 'Low interest rates', 'No collateral required'],
  },
  {
    id: '2',
    title: 'Crop Insurance',
    description: 'Comprehensive coverage against crop loss due to natural calamities',
    icon: Shield,
    eligibility: ['Active farming', 'Land documents', 'Crop details'],
    features: ['Weather protection', 'Yield guarantee', 'Premium subsidy'],
  },
  {
    id: '3',
    title: 'NABARD Schemes',
    description: 'Development schemes for agriculture and rural infrastructure',
    icon: TrendingUp,
    interestRate: '6-8% p.a.',
    eligibility: ['Rural residence', 'Agricultural activity', 'Income proof'],
    features: ['Long-term loans', 'Subsidized rates', 'Development focus'],
  },
  {
    id: '4',
    title: 'Microfinance',
    description: 'Small loans for farming equipment and working capital',
    icon: DollarSign,
    interestRate: '12-18% p.a.',
    eligibility: ['Minimal documentation', 'Group formation', 'Regular income'],
    features: ['Quick approval', 'Small amounts', 'Group support'],
  },
];

export default function FinanceScreen() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [interestRate, setInterestRate] = useState('8');
  const [loanTermYears, setLoanTermYears] = useState('5');
  const [calculatorResult, setCalculatorResult] = useState<any>(null);
  const [nearbyBanks, setNearbyBanks] = useState<any[]>([]);

  const calculateEMI = () => {
    if (!loanAmount || !loanTermYears || !interestRate) return;
    
    const principal = parseFloat(loanAmount);
    const tenure = parseInt(loanTermYears) * 12; // Convert years to months
    const rate = parseFloat(interestRate);
    
    const monthlyRate = rate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    setCalculatorResult({
      emi: emi.toFixed(2),
      totalAmount: (emi * tenure).toFixed(2),
      totalInterest: (emi * tenure - principal).toFixed(2),
    });
  };

  const applyForKCC = () => {
    Alert.alert(
      'Kisan Credit Card Application',
      'You will be redirected to the official government portal.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // In a real app, this would open the official KCC application portal
            Alert.alert('Success', 'Application submitted successfully');
          }
        },
      ]
    );
  };

  const findNearbyBanks = async () => {
    // Mock nearby banks data
    const mockBanks = [
      { name: 'State Bank of India', distance: '2.3 km', address: 'Main Market, City Center' },
      { name: 'Punjab National Bank', distance: '3.1 km', address: 'Civil Lines, Near Court' },
      { name: 'Bank of Baroda', distance: '4.2 km', address: 'Railway Station Road' },
    ];
    
    setNearbyBanks(mockBanks);
    Alert.alert('Success', 'Found nearby government banks');
  };

  const renderServiceCard = (service: FinanceService) => {
    const IconComponent = service.icon;
    const isSelected = selectedService === service.id;
    
    return (
      <TouchableOpacity
        key={service.id}
        style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
        onPress={() => setSelectedService(isSelected ? null : service.id)}
      >
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIcon}>
            <IconComponent size={24} color={Colors.primary} />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            {service.interestRate && (
              <Text style={styles.interestRate}>{service.interestRate}</Text>
            )}
          </View>
          <ArrowRight 
            size={20} 
            color={Colors.text.secondary}
            style={[styles.expandIcon, isSelected && styles.expandIconRotated]}
          />
        </View>
        
        <Text style={styles.serviceDescription}>{service.description}</Text>
        
        {isSelected && (
          <View style={styles.serviceDetails}>
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Eligibility</Text>
              {service.eligibility.map((item, index) => (
                <View key={index} style={styles.detailItem}>
                  <CheckCircle size={16} color={Colors.success} />
                  <Text style={styles.detailText}>{item}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailTitle}>Features</Text>
              {service.features.map((item, index) => (
                <View key={index} style={styles.detailItem}>
                  <CheckCircle size={16} color={Colors.primary} />
                  <Text style={styles.detailText}>{item}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Financial Services</Text>
          <Text style={styles.subtitle}>
            Access loans, insurance, and financial support for your farming needs
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹2.5L</Text>
            <Text style={styles.statLabel}>Avg. Loan Amount</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>7.5%</Text>
            <Text style={styles.statLabel}>Interest Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>15 Days</Text>
            <Text style={styles.statLabel}>Approval Time</Text>
          </View>
        </View>

        {/* Services */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          {financeServices.map(renderServiceCard)}
        </View>

        {/* EMI Calculator */}
        <View style={styles.calculatorSection}>
          <View style={styles.calculatorHeader}>
            <Calculator size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>EMI Calculator</Text>
          </View>
          
          <View style={styles.calculatorForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Loan Amount (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter loan amount"
                value={loanAmount}
                onChangeText={setLoanAmount}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tenure (months)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter tenure in months"
                value={loanTenure}
                onChangeText={setLoanTenure}
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity style={styles.calculateButton} onPress={calculateEMI}>
              <Text style={styles.calculateButtonText}>Calculate EMI</Text>
            </TouchableOpacity>
            
            {calculatorResult && (
              <View style={styles.calculatorResult}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Monthly EMI:</Text>
                  <Text style={styles.resultValue}>₹{calculatorResult.emi}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Total Amount:</Text>
                  <Text style={styles.resultValue}>₹{calculatorResult.totalAmount}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Total Interest:</Text>
                  <Text style={styles.resultValue}>₹{calculatorResult.totalInterest}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Nearby Banks */}
        <View style={styles.nearbySection}>
          <View style={styles.nearbyHeader}>
            <MapPin size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Nearby Banks</Text>
          </View>
          
          <TouchableOpacity style={styles.locationButton}>
            <Text style={styles.locationButtonText}>Find Banks Near Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  servicesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceCardSelected: {
    borderColor: Colors.primary,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  interestRate: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  serviceDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: Colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
  calculatorSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  calculatorForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  textInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
    color: Colors.text.primary,
  },
  calculateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  calculatorResult: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  nearbySection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nearbyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  locationButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});