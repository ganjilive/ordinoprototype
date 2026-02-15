import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../common';
import { efficiencyComparison } from '../../data/mockData';

export function EfficiencyChart() {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Efficiency Comparison (Time in Minutes)</CardTitle>
                <p className="text-sm text-ordino-text-muted">
                    drastic reduction in cycle time across key QA activities.
                </p>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={efficiencyComparison}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <YAxis
                                dataKey="task"
                                type="category"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                width={100}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#f8fafc',
                                }}
                                cursor={{ fill: '#334155', opacity: 0.4 }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                formatter={(value) => <span style={{ color: '#f8fafc' }}>{value}</span>}
                            />
                            <Bar dataKey="manual" name="Manual Process" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="ordino" name="With Ordino" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
