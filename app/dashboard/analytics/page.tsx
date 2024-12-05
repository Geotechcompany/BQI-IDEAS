"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAnalytics } from "@/hooks/use-analytics";
import { Skeleton } from "../../../components/ui/skeleton";

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#06b6d4", "#10b981"];

function StatCard({
  title,
  value,
  isLoading,
}: {
  title: string;
  value?: string | number;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <p className="text-4xl font-bold text-indigo-600">{value || "0"}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { user } = useUser();
  const department = user?.publicMetadata?.department as string;
  const { data, isLoading } = useAnalytics(department);

  const barData =
    data?.monthlyIdeas?.map((item) => ({
      month: new Date(item.month).toLocaleString("default", { month: "short" }),
      submitted: item.submitted,
      implemented: item.implemented,
    })) || Array(6).fill({ month: "-", submitted: 0, implemented: 0 });

  const pieData =
    data?.departmentStats?.map((item) => ({
      name: item.department,
      value: item._count._all,
    })) || Array(3).fill({ name: "No Data", value: 0 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-6 py-8"
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold text-indigo-900 mb-8"
      >
        Analytics Dashboard
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard
          title="Total Ideas"
          value={data?.totals?.total}
          isLoading={isLoading}
        />
        <StatCard
          title="Implemented"
          value={data?.totals?.implemented}
          isLoading={isLoading}
        />
        <StatCard
          title="Success Rate"
          value={`${data?.totals?.successRate || 0}%`}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Ideas Performance</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-[500px]" />
          ) : (
            <BarChart width={500} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="submitted" fill="#4f46e5" name="Submitted Ideas" />
              <Bar
                dataKey="implemented"
                fill="#10b981"
                name="Implemented Ideas"
              />
            </BarChart>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Ideas by Department</h2>
          {isLoading ? (
            <Skeleton className="h-[300px] w-[500px]" />
          ) : (
            <PieChart width={500} height={300}>
              <Pie
                data={pieData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
