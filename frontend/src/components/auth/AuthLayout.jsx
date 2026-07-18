import React from "react";

import {
  FiShield,
} from "react-icons/fi";

import {
  AuthContainer,
  LeftSection,
  Brand,
  BrandIcon,
  BrandTitle,
  BrandDescription,
  FeatureList,
  FeatureItem,
  RightSection,
} from "./AuthLayout.style";

const AuthLayout = ({
  children,
}) => {

  return (

    <AuthContainer>

      <LeftSection>

        <Brand>

          <BrandIcon>

            <FiShield />

          </BrandIcon>

          <BrandTitle>

            Contractor Worker
            <br />
            Management System

          </BrandTitle>

          <BrandDescription>

            Manage Workers, Attendance,
            Salary, Sites and Reports
            from one dashboard.

          </BrandDescription>

        </Brand>

        <FeatureList>

          <FeatureItem>

            ✓ Worker Management

          </FeatureItem>

          <FeatureItem>

            ✓ Attendance Tracking

          </FeatureItem>

          <FeatureItem>

            ✓ Salary Calculation

          </FeatureItem>

          <FeatureItem>

            ✓ Site Management

          </FeatureItem>

          <FeatureItem>

            ✓ Reports & Analytics

          </FeatureItem>

        </FeatureList>

      </LeftSection>

      <RightSection>

        {children}

      </RightSection>

    </AuthContainer>

  );

};

export default AuthLayout;