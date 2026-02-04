export const getDashboard = async (req, res) => {
  const { role, gender, name } = req.user;

  if (role === "ADMIN") {
    return res.json({
      dashboard: "ADMIN",
      access: ["BOYS", "GIRLS"],
      message: `Welcome Admin ${name}`,
    });
  }

  if (role === "STUDENT") {
    return res.json({
      dashboard: "STUDENT",
      hostel: gender === "FEMALE" ? "GIRLS" : "BOYS",
      message: `Welcome ${name}`,
    });
  }

  return res.status(403).json({ message: "Access denied" });
};
