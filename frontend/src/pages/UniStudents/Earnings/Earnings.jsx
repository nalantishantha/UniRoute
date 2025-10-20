import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  ArrowUpRight,
  Clock,
  PiggyBank,
  BarChart3,
  Building,
  User,
  Hash,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { getCurrentUser } from "../../../utils/auth";
import { earningsAPI } from "../../../utils/earningsAPI";

const INITIAL_STATS = {
  total_earnings: 0,
  total_transactions: 0,
  average_transaction: 0,
  monthly_average: 0,
  completed_transactions: 0,
  pending_transactions: 0,
  pending_amount: 0,
  current_month_total: 0,
  previous_month_total: 0,
  month_over_month: null,
  largest_transaction: null,
  last_payment: null,
  methods: [],
};

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return `LKR ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatNumber = (value) => {
  const amount = Number(value) || 0;
  return amount.toLocaleString("en-LK");
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Earnings() {
  const [timeRange, setTimeRange] = useState("6months");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState(INITIAL_STATS);
  const [trend, setTrend] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = getCurrentUser();
  const USER_ID = currentUser?.user_id;

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!USER_ID) {
        setError("Unable to determine the current user.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

  const response = await earningsAPI.getEarnings(USER_ID, { timeRange });

        if (!response.success) {
          throw new Error(response.message || "Unable to fetch earnings data");
        }

        setStats({ ...INITIAL_STATS, ...(response.stats || {}) });
        setTrend(Array.isArray(response.trend) ? response.trend : []);
        setTransactions(Array.isArray(response.transactions) ? response.transactions : []);
      } catch (err) {
        setStats({ ...INITIAL_STATS });
        setTrend([]);
        setTransactions([]);
        setError(err.message || "Failed to load earnings data");
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [USER_ID, timeRange]);

  const filteredTransactions = useMemo(() => {
    if (filterStatus === "all") return transactions;
    return transactions.filter((transaction) => transaction.status === filterStatus);
  }, [filterStatus, transactions]);

  const maxTrendAmount = trend.length
    ? Math.max(...trend.map((point) => Number(point.amount) || 0))
    : 0;
  const normalizedMax = maxTrendAmount > 0 ? maxTrendAmount : 1;

  const statCards = [
    {
      title: "Total Earnings",
      value: formatCurrency(stats.total_earnings),
      helper: `${formatNumber(stats.completed_transactions)} completed payouts`,
      change:
        stats.month_over_month !== null
          ? `${stats.month_over_month > 0 ? "+" : ""}${stats.month_over_month}% MoM`
          : null,
      icon: DollarSign,
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "Total Transactions",
      value: formatNumber(stats.total_transactions),
      helper: `${formatNumber(stats.pending_transactions)} pending`,
      change: null,
      icon: CreditCard,
      color: "from-success to-green-500",
    },
    {
      title: "Pending Amount",
      value: formatCurrency(stats.pending_amount),
      helper: Number(stats.pending_transactions)
        ? `${formatNumber(stats.pending_transactions)} awaiting settlement`
        : "All settled",
      change: null,
      icon: PiggyBank,
      color: "from-info to-blue-500",
    },
    {
      title: "Avg. Transaction",
      value: formatCurrency(stats.average_transaction),
      helper: `Monthly avg ${formatCurrency(stats.monthly_average)}`,
      change: null,
      icon: TrendingUp,
      color: "from-secondary to-warning",
    },
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="w-20 h-4 mb-2 rounded bg-neutral-light-grey" />
                      <div className="w-16 h-8 rounded bg-neutral-light-grey" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-light-grey" />
                  </div>
                  <div className="w-full h-2 mt-4 rounded-full bg-neutral-light-grey" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-16">
            <div className="h-6 rounded bg-neutral-light-grey animate-pulse" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-error">{error}</p>
            <p className="text-xs text-neutral-grey mt-2">
              Try refreshing the page or contact support if the issue persists.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          >
            <option value="6months">Last 6 Months</option>
            <option value="year">This Year</option>
            <option value="alltime">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-grey">{card.title}</p>
                  <div className="flex items-baseline mt-2 space-x-2">
                    <p className="text-2xl font-bold text-neutral-black">{card.value}</p>
                    {card.change && (
                      <span className="text-sm font-medium text-success">{card.change}</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-grey mt-1">{card.helper}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="w-full h-2 mt-4 rounded-full bg-neutral-silver">
                <div className={`h-2 rounded-full bg-gradient-to-r ${card.color}`} style={{ width: "80%" }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Earnings Trend</CardTitle>
                  <CardDescription>Monthly tutoring earnings from confirmed payments</CardDescription>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-grey">
                  <BarChart3 className="w-4 h-4" />
                  <span>{formatCurrency(stats.current_month_total)} this month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {trend.length === 0 ? (
                  <div className="w-full text-center text-sm text-neutral-grey mt-12">
                    No earnings recorded for the selected period.
                  </div>
                ) : (
                  trend.map((dataPoint, index) => (
                    <div
                      key={`${dataPoint.label}-${index}`}
                      className="flex flex-col items-center justify-end flex-1 h-full"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${Math.max(
                            (Number(dataPoint.amount || 0) / normalizedMax) * 100,
                            4,
                          )}%`,
                        }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg mb-2"
                      />
                      <span className="text-xs text-neutral-grey">{dataPoint.label}</span>
                      <span className="text-xs font-medium text-neutral-black">
                        {formatCurrency(dataPoint.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Insights</CardTitle>
              <CardDescription>Performance and payment method breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-grey">Monthly Average</p>
                  <p className="text-lg font-semibold text-neutral-black mt-1">
                    {formatCurrency(stats.monthly_average)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-grey">Last Payment</p>
                  <p className="text-sm text-neutral-black mt-1">
                    {stats.last_payment
                      ? `${formatCurrency(stats.last_payment.amount)} • ${formatDate(stats.last_payment.date)}`
                      : "No payments recorded"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-grey">Largest Payment</p>
                  <p className="text-sm text-neutral-black mt-1">
                    {stats.largest_transaction
                      ? `${formatCurrency(stats.largest_transaction.amount)} • ${stats.largest_transaction.student_name}`
                      : "No payment data"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-grey">Current / Previous Month</p>
                  <p className="text-sm text-neutral-black mt-1">
                    {formatCurrency(stats.current_month_total)} • {formatCurrency(stats.previous_month_total)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-grey mb-3">Payment Methods</p>
                {stats.methods && stats.methods.length > 0 ? (
                  <div className="space-y-2">
                    {stats.methods.map((method) => (
                      <div
                        key={method.method}
                        className="flex items-center justify-between rounded-lg border border-neutral-silver px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-black">{method.method}</p>
                          <p className="text-xs text-neutral-grey">
                            {method.count} {method.count === 1 ? "transaction" : "transactions"}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-neutral-black">
                          {formatCurrency(method.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-grey">No payment method records available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your earnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Download Statement
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Building className="w-4 h-4 mr-2" />
              Update Bank Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All tutoring payments linked to your sessions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              >
                <option value="all">All Transactions</option>
                <option value="completed">Completed Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-grey">
              No transactions found for the selected filter.
            </div>
          ) : (
            <div className="divide-y divide-neutral-silver">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-neutral-silver/50 transition-colors"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.status === "completed"
                            ? "bg-success/20 text-success"
                            : "bg-warning/20 text-yellow-600"
                        }`}
                      >
                        {transaction.status === "completed" ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-black">
                          {transaction.booking_topic || "Tutoring Payment"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-grey mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(transaction.paid_at || transaction.created_at)}</span>
                          </span>
                          {transaction.student_name && (
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{transaction.student_name}</span>
                            </span>
                          )}
                          {transaction.transaction_id && (
                            <span className="flex items-center space-x-1">
                              <Hash className="w-3 h-3" />
                              <span>{transaction.transaction_id}</span>
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-neutral-grey">
                          <div>
                            <span className="font-medium text-neutral-black">Payment Method:</span>{" "}
                            {transaction.payment_method || "Not specified"}
                          </div>
                          <div>
                            <span className="font-medium text-neutral-black">Card:</span>{" "}
                            {transaction.card_type
                              ? `${transaction.card_type} •••• ${transaction.card_last_four || "----"}`
                              : "N/A"}
                          </div>
                          <div>
                            <span className="font-medium text-neutral-black">Student Email:</span>{" "}
                            {transaction.student_email || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium text-neutral-black">Booking ID:</span>{" "}
                            {transaction.booking_id || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-[140px]">
                      <p className="text-xl font-semibold text-success">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === "completed"
                            ? "bg-success/20 text-success"
                            : "bg-warning/20 text-yellow-600"
                        }`}
                      >
                        {transaction.status === "completed" ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
