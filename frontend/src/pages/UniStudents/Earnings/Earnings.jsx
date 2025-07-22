import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  PiggyBank,
  Target,
  X,
  Building,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const earningsData = {
  totalEarnings: 12450,
  monthlyAverage: 2490,
  totalPayout: 8200,
  pendingEarnings: 4250,
  thisMonth: 2840,
  lastMonth: 2380,
  growth: 19.3,
};

const transactions = [
  {
    id: 1,
    type: "earning",
    description: "Mathematics Course Payment",
    student: "Sarah Chen",
    amount: 120,
    date: "2024-01-20",
    status: "completed",
    course: "Advanced Calculus",
  },
  {
    id: 2,
    type: "payout",
    description: "Monthly Payout",
    amount: -850,
    date: "2024-01-15",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: 3,
    type: "earning",
    description: "Physics Tutoring Session",
    student: "Michael Brown",
    amount: 80,
    date: "2024-01-18",
    status: "completed",
    course: "Quantum Physics",
  },
  {
    id: 4,
    type: "earning",
    description: "Chemistry Course Payment",
    student: "Emily Watson",
    amount: 150,
    date: "2024-01-17",
    status: "pending",
    course: "Organic Chemistry",
  },
  {
    id: 5,
    type: "earning",
    description: "Biology Mentoring",
    student: "John Doe",
    amount: 90,
    date: "2024-01-16",
    status: "completed",
    course: "Cell Biology",
  },
];

const monthlyData = [
  { month: "Jul", earnings: 1200 },
  { month: "Aug", earnings: 1800 },
  { month: "Sep", earnings: 2100 },
  { month: "Oct", earnings: 2400 },
  { month: "Nov", earnings: 2380 },
  { month: "Dec", earnings: 2840 },
];

export default function Earnings() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [timeRange, setTimeRange] = useState("6months");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType === "all") return true;
    return transaction.type === filterType;
  });

  const WithdrawModal = () => (
    <AnimatePresence>
      {showWithdrawModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowWithdrawModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-silver">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-black">
                  Request Withdrawal
                </h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 hover:bg-neutral-silver rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-neutral-grey mt-1">
                Withdraw your earnings to your bank account
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-grey">
                    Available Balance
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${earningsData.pendingEarnings.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-grey">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    max={earningsData.pendingEarnings}
                    className="w-full pl-8 pr-4 py-3 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-lg"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Withdraw 25%
                  </button>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Withdraw 50%
                  </button>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Withdraw All
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Bank Details
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-neutral-grey mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-grey mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Bank name"
                      className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-grey mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Account number"
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-grey mb-1">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        placeholder="Routing number"
                        className="w-full px-3 py-2 border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-silver p-4 rounded-lg">
                <h4 className="font-medium text-neutral-black mb-2">
                  Processing Information
                </h4>
                <ul className="text-sm text-neutral-grey space-y-1">
                  <li>• Processing time: 3-5 business days</li>
                  <li>• Processing fee: $2.50 per withdrawal</li>
                  <li>• Minimum withdrawal: $25</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-silver flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancel
              </Button>
              <Button>Request Withdrawal</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={() => setShowWithdrawModal(true)}
          >
            <Wallet className="w-4 h-4" />
            <span>Withdraw Earnings</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  ${earningsData.totalEarnings.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">
                    +{earningsData.growth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 w-full bg-neutral-silver rounded-full h-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 w-3/4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Monthly Average
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  ${earningsData.monthlyAverage.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  This month: ${earningsData.thisMonth.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-warning rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-neutral-black" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Total Payout
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  ${earningsData.totalPayout.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  Withdrawn to date
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-grey">
                  Pending Earnings
                </p>
                <p className="text-2xl font-bold text-neutral-black mt-2">
                  ${earningsData.pendingEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-grey mt-1">
                  Available for withdrawal
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-info to-blue-500 rounded-xl flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
              <CardDescription>Your monthly earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyData.map((data, index) => (
                  <div
                    key={data.month}
                    className="flex flex-col items-center flex-1"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.earnings / 3000) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg mb-2 min-h-[20px]"
                    />
                    <span className="text-xs text-neutral-grey">
                      {data.month}
                    </span>
                    <span className="text-xs font-medium text-neutral-black">
                      ${data.earnings}
                    </span>
                  </div>
                ))}
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
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowWithdrawModal(true)}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Request Withdrawal
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Download Statement
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Building className="w-4 h-4 mr-2" />
              Update Bank Details
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              View Tax Documents
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
              <CardDescription>
                Your recent earnings and payouts
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-sm border border-neutral-light-grey rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              >
                <option value="all">All Transactions</option>
                <option value="earning">Earnings Only</option>
                <option value="payout">Payouts Only</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-silver">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-neutral-silver/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "earning"
                          ? "bg-success/20 text-success"
                          : "bg-primary-100 text-primary-600"
                      }`}
                    >
                      {transaction.type === "earning" ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-black">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-neutral-grey">
                        {transaction.student && (
                          <>
                            <User className="w-3 h-3" />
                            <span>{transaction.student}</span>
                            <span>•</span>
                          </>
                        )}
                        <Calendar className="w-3 h-3" />
                        <span>{transaction.date}</span>
                        {transaction.course && (
                          <>
                            <span>•</span>
                            <span>{transaction.course}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "earning"
                          ? "text-success"
                          : "text-neutral-black"
                      }`}
                    >
                      {transaction.type === "earning" ? "+" : ""}$
                      {Math.abs(transaction.amount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === "completed"
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-yellow-600"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="p-6 border-t border-neutral-silver text-center">
            <Button variant="outline">Load More Transactions</Button>
          </div>
        </CardContent>
      </Card>

      <WithdrawModal />
    </motion.div>
  );
}
