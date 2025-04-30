import { TextStyle, ViewStyle, StyleSheet } from "react-native";

type Style = {
   
    container: ViewStyle;
    dateText: TextStyle;
    durationText: TextStyle;
    divider: ViewStyle;
    emptyText: TextStyle;
    exerciseCard: ViewStyle;
    exerciseName: TextStyle;
    exerciseDetails: TextStyle;
    summaryCard: ViewStyle;
    summaryTitle: TextStyle;
    summaryRow: ViewStyle;
    summaryColumn: ViewStyle;
    summaryLabel: TextStyle;
    summaryValue: TextStyle;
    tableHeader: ViewStyle;
    tableHeaderText: TextStyle;
    tableRow: ViewStyle;
    tableCell: TextStyle;
    calendar: ViewStyle;
    calendarCard: ViewStyle;
    filterText: TextStyle;
 
    scrollView: ViewStyle;
    calendarButton: ViewStyle;
    clearFilterText: TextStyle;
    workoutCard: ViewStyle;
    exerciseWeight: TextStyle;
    
    
};

export default StyleSheet.create<Style>({
      // Container styles
      container: {
        flex: 1,
        backgroundColor: '#000000',
      },
      scrollView: {
        flex: 1,
      },
      
      // Calendar styles
      calendarButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
      },
      calendarCard: {
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
      },
      calendar: {
        paddingHorizontal: 10,
      },
      
      // Filter styles
      filterText: {
        fontSize: 14,
        color: '#ffffff',
      },
      clearFilterText: {
        fontSize: 14,
        color: '#D60000',
        fontWeight: '800',
      },
      
      // Workout card styles
      workoutCard: {
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
      },
      dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
      },
      durationText: {
        fontSize: 15,
        color: '#ffffff',
      },
      divider: {
        backgroundColor: '#e0e0e0',
        marginVertical: 10,
      },
      emptyText: {
        color: '#666666',
        fontSize: 16,
        textAlign: 'center',
      },
      
      // Exercise card styles
      exerciseCard: {
        marginVertical: 6,
        padding: 12,
        borderRadius: 8,
      },
      exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
      },
      exerciseDetails: {
        fontSize: 14,
        color: '#ffffff',
      },
      exerciseWeight: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '500',
      },
      
      // Table styles
      tableHeader: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      },
      tableHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
      },
      tableRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      },
      tableCell: {
        fontSize: 14,
        color: '#ffffff',
      },
      
      // Summary section styles
      summaryCard: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#141212',
        borderRadius: 8,
      },
      summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
      },
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      summaryColumn: {
        alignItems: 'center',
        flex: 1,
      },
      summaryLabel: {
        fontSize: 12,
        color: '#ffffff',
        marginBottom: 4,
      },
      summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5166cf',
      },

    });
