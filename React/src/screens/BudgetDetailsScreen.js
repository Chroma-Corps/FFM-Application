import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
import BackButton from '../components/BackButton';
import InAppBackground from '../components/InAppBackground';
import EditButton from '../components/EditButton';
import ProgressBar from '../components/ProgressBar';
import DonutChart from '../components/DonutChart';

const categoryImages = {
    shopping: require('../assets/icons/shopping.png'),
    transit: require('../assets/icons/transit.png'),
    entertainment: require('../assets/icons/entertainment.png'),
    bills: require('../assets/icons/bills.png'),
    groceries: require('../assets/icons/groceries.png'),
    income: require('../assets/icons/income.png'),
    default: require('../assets/default_img.jpg')
};

const parseTransactionAmount = (amountString) =>
    ({ amount: parseFloat(String(amountString).replace(/[^0-9.]/g, '')) || 0 });

export default function BudgetDetailsScreen({ navigation, route }) {
    const { budgetID } = route.params;
    const [budgetDetails, setBudgetDetails] = useState(null);
    const [budgetTransactions, setBudgetTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({ series: [], keyData: [] });

    const stablePieChartColors = useMemo(() => [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7CAC9', '#A0E7E5', '#B4F8C8', '#FFD166', '#06D6A0',
        '#118AB2', '#073B4C', '#E76F51', '#F4A261', '#2A9D8F'
    ], []);

    const categoryColorMap = useMemo(() => new Map(), []);

    const getCategoryColor = useCallback((categoryName) => {
        const name = categoryName.toLowerCase();
        if (!categoryColorMap.has(name)) {
            const colorIndex = categoryColorMap.size % stablePieChartColors.length;
            categoryColorMap.set(name, stablePieChartColors[colorIndex]);
        }
        return categoryColorMap.get(name);
    }, [categoryColorMap, stablePieChartColors]);

    const setDefaultChart = (message) => {
        const defaultColor = theme.colors.disabled || '#CCCCCC';
        const isNoTransactionMessage = message.includes('No Spending') || message.includes('No Budget Data') || message.includes('No transactions');

        setChartData({
            series: [{ value: 1, color: defaultColor }],
            keyData: [{
                name: isNoTransactionMessage ? "No Associated Transactions" : message,
                color: defaultColor,
                image: isNoTransactionMessage ? null : categoryImages.default
            }]
        });
    };

    useEffect(() => {
        const fetchBudgetDetails = async () => {
            try {
                const response = await fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}`);
                const data = await response.json();
                if (response.ok) {
                    setBudgetDetails(data.budget);
                } else {
                    console.error("Fetch Budget Details Error:", data.message);
                    setBudgetDetails(null);
                }
            } catch (error) {
                console.error('Error fetching budget details:', error);
                setBudgetDetails(null);
            }
        };

        const fetchBudgetTransactions = async () => {
            try {
                const response = await fetch(`https://ffm-application-main.onrender.com/budget/${budgetID}/transactions`);
                const data = await response.json();
                if (response.ok) {
                    setBudgetTransactions(data.transactions || []);
                } else {
                    console.error("Fetch Budget Transactions Error:", data.message);
                    setBudgetTransactions([]);
                }
            } catch (error) {
                console.error('Error Fetching Budget Transactions:', error);
                setBudgetTransactions([]);
            }
        };

        const loadData = async () => {
            setLoading(true);
            categoryColorMap.clear();
            await fetchBudgetDetails();
            await fetchBudgetTransactions();
            setLoading(false);
        };

        loadData();
    }, [budgetID, categoryColorMap]);

    useEffect(() => {
        if (!budgetDetails || !budgetDetails.transactionScope || !budgetTransactions) {
            setDefaultChart('Loading Budget Data...');
            return;
        }

        let categorySpending = {};
        const seriesWithObjects = [];
        const keyData = [];
        let hasSpending = false;
        const scope = budgetDetails.transactionScope.toUpperCase();

        if (scope === 'INCLUSIVE') {
            if (budgetDetails.budgetCategory && budgetDetails.budgetCategory.length > 0) {
                budgetDetails.budgetCategory.forEach(category => {
                    categorySpending[category.toLowerCase()] = 0;
                });

                budgetTransactions.forEach(transaction => {
                    const { amount } = parseTransactionAmount(transaction.transactionAmount);
                    if (Array.isArray(transaction.transactionCategory)) {
                        transaction.transactionCategory.forEach(category => {
                            const key = category.toLowerCase();
                            if (categorySpending.hasOwnProperty(key)) {
                                categorySpending[key] += amount;
                                if (amount > 0) hasSpending = true;
                            }
                        });
                    }
                });

                budgetDetails.budgetCategory.forEach(categoryName => {
                    const key = categoryName.toLowerCase();
                    const spending = categorySpending[key];
                    if (spending > 0) {
                        const color = getCategoryColor(key);
                        seriesWithObjects.push({ value: spending, color });
                        const imageKey = categoryImages[key] ? key : 'default';
                        keyData.push({
                            name: categoryName,
                            color,
                            image: categoryImages[imageKey]
                        });
                    }
                });
            }

        } else if (scope === 'EXCLUSIVE') {
            budgetTransactions.forEach(transaction => {
                const { amount } = parseTransactionAmount(transaction.transactionAmount);
                if (amount > 0) {
                    hasSpending = true;
                    let categories = transaction.transactionCategory;
                    if (!Array.isArray(categories) || categories.length === 0) {
                        categories = ['Uncategorized'];
                    }

                    categories.forEach(category => {
                        const key = category.toLowerCase();
                        categorySpending[key] = (categorySpending[key] || 0) + amount;
                    });
                }
            });

            Object.entries(categorySpending).forEach(([categoryKey, spending]) => {
                if (spending > 0) {
                    const color = getCategoryColor(categoryKey);
                    seriesWithObjects.push({ value: spending, color });
                    const displayName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
                    const imageKey = categoryImages[categoryKey] ? categoryKey : 'default';
                    keyData.push({
                        name: displayName,
                        color,
                        image: categoryImages[imageKey]
                    });
                }
            });
        }

        if (seriesWithObjects.length === 0) {
            setDefaultChart(hasSpending ? 'Spending Outside Scope' : 'No Spending Recorded Yet');
        } else {
            keyData.sort((a, b) => a.name.localeCompare(b.name));
            setChartData({ series: seriesWithObjects, keyData });
        }
    }, [budgetTransactions, budgetDetails, getCategoryColor]);


    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!budgetDetails) {
        return (
            <View style={styles.container}>
                <InAppBackground>
                    <BackButton goBack={navigation.goBack} />
                    <View style={styles.centered}>
                        <Text style={styles.descriptionText}>Budget details could not be loaded.</Text>
                    </View>
                </InAppBackground>
            </View>
        );
    }

    const getPrimaryCategoryImage = (category) => {
        const name = Array.isArray(category) ? category[0] : category;
        const key = (name || '').toLowerCase();
        return categoryImages[key] || categoryImages.default;
    };

    const renderTransaction = ({ item }) => {
        const transactionCategoryString = Array.isArray(item.transactionCategory) && item.transactionCategory.length > 0
            ? item.transactionCategory.join(' • ')
            : (typeof item.transactionCategory === 'string' && item.transactionCategory.trim() !== ''
                ? item.transactionCategory
                : 'Uncategorized');

        const categoryImageSource = getPrimaryCategoryImage(item.transactionCategory);

        return (
            <View style={styles.transactionCard}>
                <Text style={styles.transactionTitle}>{item.transactionTitle}</Text>
                <Text style={styles.transactionAmount}>{item.transactionAmount}</Text>

                <View style={[styles.categoryRow, { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }]}>
                    {Array.isArray(item.transactionCategory) && item.transactionCategory.length > 0 ? (
                        item.transactionCategory.map((cat, index) => {
                            const imageKey = cat.toLowerCase();
                            const imageSource = categoryImages[imageKey] || categoryImages.default;

                            return (
                                <View key={`${item.transactionID}-${index}`} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
                                    <Image
                                        source={imageSource}
                                        style={[styles.categoryImage, { marginRight: 4 }]}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.descriptionText, styles.categoryTextWithImage]}>
                                        {cat}
                                    </Text>
                                    {index < item.transactionCategory.length - 1 && (
                                        <Text style={[styles.descriptionText, { marginHorizontal: 4 }]}> •</Text>
                                    )}
                                </View>
                            );
                        })
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={categoryImages.default}
                                style={[styles.categoryImage, { marginRight: 4 }]}
                                resizeMode="contain"
                            />
                            <Text style={[styles.descriptionText, styles.categoryTextWithImage]}>Uncategorized</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.descriptionText}>
                    {new Date(item.transactionDate).toLocaleDateString()}
                </Text>
                {item.transactionDescription && (
                    <Text style={styles.descriptionText}> {item.transactionDescription}</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <InAppBackground>
                <BackButton goBack={navigation.goBack} />
                <EditButton />
                <ScrollView contentContainerStyle={styles.scrollContentContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.titleText}>{budgetDetails.budgetTitle}</Text>
                        <Text style={styles.amountText}>
                            <Text style={styles.amountTextBold}>{budgetDetails.remainingBudgetAmount} </Text>
                            left of {budgetDetails.budgetAmount}
                        </Text>
                        <View style={styles.progressBarContainer}>
                            <ProgressBar
                                startDate={budgetDetails.startDate}
                                endDate={budgetDetails.endDate}
                                budgetColorTheme={theme.colors.secondary}
                            />
                            <Text style={[styles.categoryText,
                            {
                                backgroundColor: (budgetDetails.budgetType || '').toUpperCase() === 'EXPENSE' ? '#E57373' : '#81C784'
                            }
                            ]}>
                                {budgetDetails.budgetType ?? 'Type N/A'} Budget
                            </Text>

                        </View>
                    </View>

                    <View style={styles.chartSectionContainer}>
                        <Text style={[styles.descriptionText, styles.sectionTitle]}>Budget Activity</Text>
                        <View style={styles.chartAndKeyWrapper}>
                            <View style={styles.chartContainer}>
                                <DonutChart
                                    widthAndHeight={180}
                                    series={chartData.series}
                                    coverRadius={0.45}
                                    coverFill={theme.colors.background || '#181818'}
                                />
                            </View>
                            <View style={styles.graphKeyContainer}>
                                {chartData.keyData.map((data, index) => (
                                    <View key={`${data.name}-${index}-key`} style={styles.keyRow}>
                                        <View style={[styles.keyColorBlock, { backgroundColor: data.color }]} />
                                        <Image source={data.image} style={styles.keyImage} resizeMode="contain" />
                                        <Text style={[styles.keyText, { flexShrink: 1 }]}>{data.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.transactionsActivityContainer}>
                        <Text style={[styles.descriptionText, styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                            Transactions Activity
                        </Text>
                        <View style={styles.transactionsList}>
                            {budgetTransactions.length > 0 ? (
                                budgetTransactions.map(item => renderTransaction({ item, key: item.id }))
                            ) : (
                                <Text style={[styles.descriptionText, { textAlign: 'center', marginTop: 20 }]}>
                                    No transactions recorded for this budget yet.
                                </Text>
                            )}
                        </View>
                    </View>

                </ScrollView>
            </InAppBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContentContainer: {
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    headerContainer: {
        borderColor: theme.colors.primary,
        padding: 15,
        marginTop: 40,
        borderBottomWidth: 3,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    titleText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'left',
    },
    descriptionText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.medium.fontFamily,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: theme.fonts.bold.fontFamily,
        marginBottom: 10,
        marginTop: 20,
        color: theme.colors.textSecondary,
    },
    categoryText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        alignSelf: 'center',
        padding: 8,
        borderRadius: 18,
    },
    amountText: {
        fontSize: 15,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.bold.fontFamily,
        textAlign: 'left',
        paddingTop: 8,
        marginBottom: 5,
    },
    amountTextBold: {
        fontFamily: theme.fonts.bold.fontFamily,
    },
    progressBarContainer: {
        marginTop: 15,
    },
    chartSectionContainer: {
        marginTop: 25,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    chartAndKeyWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 15,
        marginBottom: 15,
    },
    chartContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    graphKeyContainer: {
        flex: 1,
        marginLeft: 20,
        justifyContent: 'center',
    },
    keyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    keyColorBlock: {
        width: 12,
        height: 12,
        borderRadius: 3,
        marginRight: 8,
    },
    keyImage: {
        width: 18,
        height: 18,
        marginRight: 8,
    },
    keyText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
    },
    transactionsActivityContainer: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    transactionsList: {
        marginTop: 5,
    },
    transactionCard: {
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: theme.colors.secondary,
        backgroundColor: theme.colors.surface + '11',
    },
    transactionTitle: {
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 18,
        marginBottom: 4,
    },
    transactionAmount: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.bold.fontFamily,
        fontSize: 16,
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.bold.fontFamily,
        lineHeight: 20,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 4,
    },
    categoryImage: {
        width: 16,
        height: 16,
        marginRight: 6,
    },
    categoryTextWithImage: {
        flexShrink: 1,
    },
    dateText: {
        fontSize: 14,
        fontFamily: theme.fonts.bold.fontFamily,
        color: theme.colors.textSecondary,
        lineHeight: 21,
        textAlign: 'left',
        paddingTop: 10
    },
});